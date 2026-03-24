// lib/initTestContext.ts
import { test as base } from '@playwright/test';
import fs from 'node:fs';
import * as path from 'node:path';

interface JsonData {
  [key: string]: any;
}

type TestContextType = {
  testContext: {
    data: JsonData;
  };
};

export const test = base.extend<TestContextType>({
  testContext: async ({}, use) => {
    const env = process.env.npm_config_ENV || `qa`;

    const directoryPath = path.resolve(
      process.cwd(),
      `test-data`,
      `data`,
      env
    );

    console.log(`Loading test data from:`, directoryPath);

    if (!fs.existsSync(directoryPath)) {
      throw new Error(
        `Test data directory not found: ${directoryPath}`
      );
    }

    const jsonData: JsonData = {};

    fs.readdirSync(directoryPath).forEach((fileName) => {
      if (!fileName.endsWith(`.json`)) return;

      const filePath = path.join(directoryPath, fileName);
      const key = fileName.replace(`.json`, ``);

      jsonData[key] = JSON.parse(
        fs.readFileSync(filePath, `utf8`)
      );
    });

    console.log(`Loaded testContext keys:`, Object.keys(jsonData));

    await use({ data: jsonData });
  },
});


export { expect } from '@playwright/test';
