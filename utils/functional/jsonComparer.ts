import { expect } from "@playwright/test";
export interface DiffResult {
  section: string;
  field: string;
  uiValue: any;
  excelValue: any;
}

export const compareUiVsExcelJson = (
  uiJson: any,
  excelJson: any,
  excludedFields: string[] = []
): DiffResult[] => {
  const differences: DiffResult[] = [];

  const excluded = excludedFields.map(f => f.toLowerCase());

  for (const section of Object.keys(uiJson)) {
    const uiSection = normalizeSection(uiJson[section]);
    const excelSectionKey = findCaseInsensitiveKey(excelJson, section);

    if (!excelSectionKey) {
      differences.push({
        section,
        field: `Section Missing in Excel JSON`,
        uiValue: uiSection,
        excelValue: null
      });
      continue;
    }

    const excelSection = normalizeSection(excelJson[excelSectionKey]);

    // -------- UI → Excel comparison
    for (const field of Object.keys(uiSection)) {
      if (excluded.includes(field.toLowerCase())) continue;

      const excelFieldKey = findCaseInsensitiveKey(excelSection, field);

      if (!excelFieldKey) {
        differences.push({
          section,
          field,
          uiValue: uiSection[field],
          excelValue: `Missing in Excel JSON`
        });
        continue;
      }

      const uiValue = normalizeValue(uiSection[field]);
      const excelValue = normalizeValue(excelSection[excelFieldKey]);

      if (uiValue !== excelValue) {
        differences.push({
          section,
          field,
          uiValue,
          excelValue
        });
      }
    }

    // -------- Excel → UI comparison (missing in UI)
    for (const excelField of Object.keys(excelSection)) {
      if (excluded.includes(excelField.toLowerCase())) continue;

      const uiFieldExists = Object.keys(uiSection).some(
        f => f.toLowerCase() === excelField.toLowerCase()
      );

      if (!uiFieldExists) {
        differences.push({
          section,
          field: excelField,
          uiValue: `Missing in UI JSON`,
          excelValue: excelSection[excelField]
        });
      }
    }
  }

  return differences;
};

const normalizeSection = (section: any): any =>
  Array.isArray(section) ? section[0] : section;

const findCaseInsensitiveKey = (
  obj: Record<string, any>,
  key: string
): string | undefined =>
  Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());

const normalizeValue = (value: any): string => {
  if (value === null || value === undefined) return ``;

  // Numeric normalization (0.000 == 0.00)
  if (!isNaN(value)) {
    return Number(value).toString();
  }

  return String(value).trim();
};
