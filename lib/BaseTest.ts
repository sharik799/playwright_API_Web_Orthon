import { test as baseTest, TestInfo } from '@playwright/test';
import { ApiBase } from '../api/base/ApiBase';
import { LocationApi } from '../api/apiActions/LocationApi';
import { LoginPage } from '@pages/LoginPage';
import { WidgetsPage } from '@pages/WidgetsPage';
import { InteractionsPage } from '@pages/InteractionsPage';
import { WebActions } from '@lib/WebActions';
import AxeBuilder from '@axe-core/playwright';

export const test = baseTest.extend<{
  apiBase: ApiBase;
  locationApi: LocationApi;
  webActions: WebActions;
  loginPage: LoginPage;
  widgetsPage: WidgetsPage;
  interactionsPage: InteractionsPage;
  makeAxeBuilder: AxeBuilder;
  testInfo: TestInfo;
}>({
  /* =========================
   * Base API context
   * ========================= */
  apiBase: async ({}, use) => {
    const apiBase = new ApiBase();
    await use(apiBase);
  },

  /* =========================
   * API objects
   * ========================= */
  locationApi: async ({ apiBase }, use) => {
    const locationApi = new LocationApi(apiBase);
    await use(locationApi);
  },

  /* =========================
   * UI Page objects
   * ========================= */
  webActions: async ({ page }, use) => {
    await use(new WebActions(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  widgetsPage: async ({ page }, use) => {
    await use(new WidgetsPage(page));
  },
  interactionsPage: async ({ page }, use) => {
    await use(new InteractionsPage(page));
  },

  /* =========================
   * Accessibility fixture
   * ========================= */
  makeAxeBuilder: async ({ page }, use) => {
    await use(
      new AxeBuilder({ page })
        .withTags([`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`])
        .exclude(`#commonly-reused-element-with-known-issue`)
    );
  },

  /* =========================
   * TestInfo
   * ========================= */
  testInfo: async ({}, use, testInfo) => {
    await use(testInfo);
  },
});

export { expect } from '@playwright/test';

// import {
//   mergeTests,
//   mergeExpects,
//   expect as baseExpect,
// } from '@playwright/test';

// import { test as pageObjectTest } from '../lib/initPageObject';
// import { test as testContextTest } from '../lib/initTextContext';
// import { test as apiTest } from '../lib/initApiContext';

// export const test = mergeTests(
//   pageObjectTest,
//   testContextTest,
//   apiTest
// );

// export const expect = mergeExpects(baseExpect);
