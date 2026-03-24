
import { test, expect } from '../../lib/BaseTest';

test.describe(`@ Type Q&A @smoke @regression`, () => {

  test.beforeEach(`Login and Navigate to the  Screen`, async ({ loginPage }) => {
    await loginPage.navigateToURL();
  });

  test(`New tab handling example`, async ({ loginPage, page, context }) => {

  // Step 1: Login
  await loginPage.loginToApplication();

  // // Step 2: Open new tab
  // const newTab = await context.newPage();

  // // Step 3: Navigate to Google
  // await newTab.goto(`https://www.google.com`);

  // // Step 4: Search for laptop
  // await newTab.locator(`textarea[name="q"]`).fill(`laptop`);
  // await newTab.keyboard.press(`Enter`);

  // await newTab.waitForLoadState(`domcontentloaded`);

  // // Optional validation
  // await expect(newTab).toHaveURL(/search/);

  // // Step 5: Close new tab
  // await newTab.close();

  // // Step 6: Back to original tab
  // await page.bringToFront();

  // // Continue your original test
  // await page.waitForLoadState(`domcontentloaded`);
});

  // test(`Metric Screen and Metric Type validations @smoke @regression`, async ({loginPage, page }) => {

  //   await page.waitForLoadState(`domcontentloaded`);
  //   await loginPage.loginToApplication();
  // });

  // test(`Creating Metric Type as Q&A and validating it through DB @Q&A @smoke @regression`, async ({ loginPage, page }) => {

  //           await loginPage.loginToApplication();


  // });

  // test('API end to end flow for metric Q&A', async ({ apiBase,locationApi }) => {

    // await apiBase.login('v1');
    // await locationApi.pickOutlet('v8', { outletCode});    
    
  // });

});
