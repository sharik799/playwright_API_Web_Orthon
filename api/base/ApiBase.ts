import { request, APIRequestContext } from '@playwright/test';
import { ENDPOINTS } from '../apiRegistry.ts/endPoints';

type LoginVersion = number | `v${number}`;

export class ApiBase {
  private context!: APIRequestContext;
  private token!: string;
  private username!: string;

  private resolveLoginEndpoint(version: LoginVersion): string {
    const v =
      typeof version === `number`
        ? `V${version}`
        : `V${version.replace(`v`, ``)}`;

    const endpoint = ENDPOINTS.AUTH.LOGIN[v];
    if (!endpoint) {
      throw new Error(`Login endpoint not found for ${version}`);
    }
    return endpoint;
  }

  async login(version: LoginVersion = `v1`): Promise<APIRequestContext> {
  if (!process.env.BASE_URL) {
    throw new Error(`BASE_URL not set`);
  }

  //  Declare local variables
  const username = process.env.API_USER;
  const password = process.env.API_PASS;

  if (!username || !password) {
    throw new Error(`API_USER or API_PASS not set`);
  }

  // Store username in instance for later use
  this.username = username;

  const baseURL = process.env.BASE_URL.replace(/\/$/, ``);
  const loginPath = this.resolveLoginEndpoint(version);

  const loginContext = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Content-Type': `application/x-www-form-urlencoded`,
      Accept: `application/json`,
      'Accept-Encoding': `identity`,
    },
  });

  const response = await loginContext.post(loginPath, {
    form: {
      username,  
      password, 
    },
  });

  const raw = await response.text();
  let body: any;

  try {
    body = JSON.parse(raw);
  } catch {
    throw new Error(`Login response is not valid JSON:\n${raw}`);
  }

  this.token =
    body?.authToken ||
    body?.token ||
    body?.data?.authToken;

  if (!this.token) {
    throw new Error(`authToken not found in login response`);
  }

  await loginContext.dispose();

  this.context = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': `application/json`,
      Accept: `application/json`,
    },
  });

  return this.context;
}


  getContext() {
    return this.context;
  }

  getToken() {
    return this.token;
  }

    getUsername(): string {
    if (!this.username) {
      throw new Error(`Username not set. Call login() first.`);
    }
    return this.username;
  }
}
