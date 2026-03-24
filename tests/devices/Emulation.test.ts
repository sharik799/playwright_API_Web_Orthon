import  { test } from '../../lib/BaseTest';

test(`Verify Elements Page.`, async ({ PO }) => {
    await PO.loginPage.navigateToURL();
    await PO.webActions.clickByText(`Elements`); // Click on Elements Icon identified via text selector
    await PO.webActions.clickByText(`Text Box`); //Click on TextBox Navigation Sidebar identified via text selector
});