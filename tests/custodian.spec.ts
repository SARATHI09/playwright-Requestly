import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import rolesData from "../fixtures/resource/rolesData.json";
import { CustodianPages } from "../pages/custodianPages";

test.describe("Custodian Login", () => {
  const selector = new Selectors();
  const email = "trystan828@yopmail.com";
  const password = "Trystan@404";
  let loginPage: LoginPage;
  let custodian: CustodianPages;
  
  test.beforeEach(async ({ page }) => {
    await page.goto("http://13.126.213.18:4000/");
    loginPage = new LoginPage(page, selector);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
    custodian = new CustodianPages(page, selector);
  });

  test("Edit Custodian flow: search, open, verify, attach, move to query", async ({ page }) => {
    await custodian.switchToCustodianRole();
    await custodian.searchAndOpenProjectGroup();
    await custodian.searchAndOpenProject();
    await custodian.verifyRequirementHeader();
    await custodian.verifyAutoFetchedFields();
    await custodian.addAttachment();
    await custodian.moveToQuery();
  });

  test("Logout", async ({ page }) => {
    await loginPage.logout();
    await expect(page).toHaveURL(/.*\/login$/);
  });
});


