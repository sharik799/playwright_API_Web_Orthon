import basePayload from '../payload/location.payload.json';

export type LocationPayload = typeof basePayload.location.list;

type LocationVersion = number | `v${number}`;

type PickOutletCriteria = {
  outletCode: string;
};

export class LocationApi {
  constructor(private readonly api: any) {}

  /* =========================
   * Payload wrapper (static + dynamic)
   * ========================= */
  private buildPayload(overrides?: Partial<LocationPayload>): LocationPayload {
    return {
      ...basePayload.location.list,
      ...overrides,
    };
  }

  /* =========================
   * Resolve endpoint by version
   * ========================= */
  private resolveEndpoint(version: LocationVersion): string {
    const v =
      typeof version === `number`
        ? `V${version}`
        : `V${version.replace(`v`, ``)}`;

    const endpoint = this.api.endpoints.LOCATION[v];

    console.log(`Resolved LOCATION endpoint → ${endpoint}`);

    if (!endpoint) {
      throw new Error(`LocationList endpoint not found for ${version}`);
    }

    return endpoint;
  }

  /* =========================
   * Get location list
   * ========================= */
  async getLocationList(version: LocationVersion, payloadOverrides?: Partial<LocationPayload>) {
    const endpoint = this.resolveEndpoint(version);

    const payload = this.buildPayload(payloadOverrides);

    const response = await this.api.post(endpoint, { data: payload });

    if (!response.ok()) {
      throw new Error(`LocationList failed: ${response.status()}`);
    }

    return response.json();
  }

  /* =========================
   * Pick outlet (STRICT by line3['Outlet Code'])
   * ========================= */
  async pickOutlet(
    version: LocationVersion,
    criteria: PickOutletCriteria,
    payloadOverrides?: Partial<LocationPayload>
  ): Promise<string> {
    const body = await this.getLocationList(version, payloadOverrides);

    const records = body?.records;

    if (!Array.isArray(records)) {
      throw new Error(`Invalid Location API response: records not found`);
    }

    const normalize = (val?: string) => val?.toString().trim().toLowerCase();

    const outlet = records.find((record: any) => {
      const outletCodeFromRecord = record?.line3?.[`Outlet Code`];
      return normalize(outletCodeFromRecord) === normalize(criteria.outletCode);
    });

    if (!outlet) {
      console.error(`Outlet NOT FOUND for outletCode:`, criteria.outletCode);
      console.error(
        `Available outlet codes from response:`,
        records.map((r: any) => r?.line3?.[`Outlet Code`])
      );
      throw new Error(`Outlet not found for outletCode: ${criteria.outletCode}`);
    }

    const outletCode = outlet.line3[`Outlet Code`];

    this.api.setOutletCode(outletCode);

    console.log(`Picked Outlet (STRICT):`, {
      outletCode,
      outletName: outlet.locationName ?? outlet?.line1?.[`Outlet Name`],
    });

    return outletCode;
  }
}