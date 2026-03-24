import { PlaywrightTestConfig, devices } from "@playwright/test";
import { testConfig } from './testConfig';
import { OrtoniReportConfig } from 'ortoni-report';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Resolve environment from npm_config_ENV
 * (Required as config/command cannot be changed)
 */
const ENV = process.env.npm_config_ENV || `qa`;

/**
 * Detect CI (kept from your original logic)
 */
const isCI =
  process.env.CI === `true` ||
  process.env.AZURE_HTTP_USER_AGENT !== undefined;

/**
 * Build absolute path to env file
 * IMPORTANT: dotenv paths must be absolute to avoid silent failure
 */
const envFilePath = path.resolve(
  process.cwd(),
  `environments`,
  `${ENV}.env`
);

/**
 * Load env file ONCE
 */
dotenv.config({ path: envFilePath });



/**
 * Optional hard guard (recommended)
 * Fail fast if env file did not load
 */
if (!process.env.BASE_URL) {
  throw new Error(
    `BASE_URL is undefined. Failed to load env file: ${envFilePath}`
  );
}



/**
 *  FIXED Ortoni Config (separate folder)
 */
const reportConfig: OrtoniReportConfig = {
  base64Image: true,
  title: `Scroll Finance Test Automation`,
  showProject: true,
  filename: `OrtoniHtmlReport`,
  preferredTheme: `dark`,
  folderPath: `.html-report/ortoni-report`, 
  projectName: `Scroll Finance Automation Framework`,
};

const config: PlaywrightTestConfig = {

  //Global Setup to run before all tests
  globalSetup: `./global-setup`,

  //sets timeout for each test case
  timeout: 180000,

  //number of retries if test case fails
  retries: 0,
  workers: 1,

  //Reporters
  reporter: [
    [`ortoni-report`, reportConfig], 
    [`junit`, { outputFile: `junit-results/results.xml` }],
    [`allure-playwright`],
    [`html`, { outputFolder: `./html-report`, open: isCI ? `never` : `on-failure` }]
  ],


  projects: [
    {
      name: `Chrome`,
      retries: 0,
      use: {
        // Configure the browser to use.
        browserName: `chromium`,
        //Chrome Browser Config
        channel: `chrome`,
        //Picks Base Url based on User input
        baseURL: testConfig[ENV],
        //Browser Mode
        headless: isCI,
        // headless: true,
        //Browser height and width
        viewport: null,
        ignoreHTTPSErrors: true,
        //Enable File Downloads in Chrome
        acceptDownloads: true,
        //Artifacts
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,

        //Slows down execution by ms
        launchOptions: {
          slowMo: 2000,
          args: [`--start-maximized`]
        }
      },
    },
    // {
    //   name: `Chromium`,
    //   use: {
    //     browserName: `chromium`,
    //     baseURL: testConfig[ENV],
    //     headless: false,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },

    // {
    //   name: `Firefox`,
    //   use: {
    //     browserName: `firefox`,
    //     baseURL: testConfig[ENV],
    //     headless: false,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },

    // {
    //   name: `Edge`,
    //   use: {
    //     browserName: `chromium`,
    //     channel: `msedge`,
    //     baseURL: testConfig[ENV],
    //     headless: false,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },
    // {
    //   name: `WebKit`,
    //   use: {
    //     browserName: `webkit`,
    //     baseURL: testConfig[ENV],
    //     headless: false,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },
    // {
    //   name: `Device`,
    //   use: {
    //     ...devices[`Pixel 4a (5G)`],
    //     browserName: `chromium`,
    //     channel: `chrome`,
    //     baseURL: testConfig[ENV],
    //     headless: false,
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },
    // {
    //   name: `DB`
    // },
    // {
    //   name: `API`,
    //   use: {
    //     baseURL: testConfig[ENV]
    //   }
    // }
  ],
  
};

export default config;