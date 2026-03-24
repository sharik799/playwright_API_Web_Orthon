import { Page, BrowserContext, Locator, expect } from "@playwright/test";
import { WebActions } from "@lib/WebActions";
import { testConfig } from "../../testConfig";
import CustomReporterConfig from "../../CustomReporterConfig";

const logger = CustomReporterConfig;
let webActions: WebActions;

export const config = {
  username: `test`,
  password: `test!@`,
};

export class LoginPage {
  readonly page: Page;
    readonly USERNAME_INPUT: Locator;
    readonly PASSWORD_INPUT: Locator;
    readonly LOGIN_BUTTON: Locator;

  constructor(page: Page) {
    this.page = page;
    webActions = new WebActions(this.page);
     this.USERNAME_INPUT = page.locator(`(//input[@aria-invalid='false'])[1]`);
    this.PASSWORD_INPUT = page.locator(`//*[@type='password']`);
    this.LOGIN_BUTTON = page.locator(`(//span[@class='MuiButton-label'])[1]`);

 }

  /*
    This method will perform navigation on site url
    */
  async navigateToURL(): Promise<void> {
    await this.page.goto(` `);
    await this.page.waitForLoadState(`networkidle`);
    logger.logInfo(`Successfully navigated on site url`);
  }

  /*
    This method will perform click on login button after providing username and password
    */
  async loginToApplication(UserName?: string, Password?: string): Promise<void> {
    const username = UserName ?? process.env.UserName_Admin ?? config.username;
    const password = Password ?? process.env.Password ?? config.password;
    if (!username || !password) {
      throw new Error(`Missing username or password. Provide them as in testMethod, env vars, or config.`);
    }
    await this.USERNAME_INPUT.fill(username);
    logger.logInfo(`Successfully inserted ${username} as value in username text field`);
    await this.PASSWORD_INPUT.fill(password);
    logger.logInfo(`Successfully inserted ${password} as value in password text field`);
    await this.LOGIN_BUTTON.click();
    logger.logInfo(`Successfully provided user credentials and clicked on login button.`);
  }
}
