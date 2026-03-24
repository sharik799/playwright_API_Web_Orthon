import  {test } from '../../lib/BaseTest';
import { expect } from "@playwright/test";

test(`Verify Page Accessibility`, async ({ page }) => {
    await page.goto(`https://google.com/`);
    // const accessibilityScanResults = await PO.makeAxeBuilder.analyze();
    // Automatically uses the shared AxeBuilder configuration,
    // expect(accessibilityScanResults.violations).toEqual([]);
});