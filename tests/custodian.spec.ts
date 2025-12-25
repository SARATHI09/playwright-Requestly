import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import activateDetails from "../fixtures/resource/activateDetails.json";
import custodianData from "../fixtures/resource/custodianData.json";
import { CustodianPages } from "../pages/custodianPages";

test.describe("Custodian Login", () => {
  const selector = new Selectors();
  let loginPage: LoginPage;
  let custodian: CustodianPages;
  const custodianName = custodianData.custodianName;
  const custodianUser = (activateDetails as Array<{ empName: string; email: string; password: string }>).find((u) => u.empName === custodianName);
  const email = custodianUser?.email ?? "";
  const password = custodianUser?.password ?? "";
  // const url = process.env.BaseUrl!;
  test.beforeEach(async ({ page }) => {
    // console.log("??",url );
    await page.goto("/");
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


