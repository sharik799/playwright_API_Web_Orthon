import test, { expect, Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "pageFactory/pageRepository/LoginPage";
import CustomReporterConfig from "../../CustomReporterConfig"; // Import the default exported class
const logger = CustomReporterConfig;

const config = {
  
  username: `test`,
  password: `test!@`,
};

test.describe(`IRed Portal Login Tests`, () => {
  let browserContext: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;

  // Set up a single browser context and page for all tests
  test.beforeAll(async ({ browser }) => {
    browserContext = await browser.newContext(); // Create a new browser context
    page = await browserContext.newPage(); // Create a new page within that context
    loginPage = new LoginPage(page); // Initialize LoginPage with page and context
  });

  // Clean up by closing the context after all tests
  test.afterAll(async () => {
    await browserContext.close(); // Close the context and all pages after all tests
  });

  test(
    `Verify is user able to navigate to website url`,
    { tag: `@Smoke` },
    async () => {
      await loginPage.navigateToURL(); // Navigate to the login page
      logger.logInfo(`Successfully logged to website url`);
    }
  );
});
