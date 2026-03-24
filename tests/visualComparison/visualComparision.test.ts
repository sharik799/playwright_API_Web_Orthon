import {test} from '../../lib/BaseTest';
import { expect } from '@playwright/test';
test(`Verify Elements Page.`, async ({ page, PO }) => {
    await PO.loginPage.navigateToURL();
    expect(await page.screenshot()).toMatchSnapshot(`MainPage.png`);
});