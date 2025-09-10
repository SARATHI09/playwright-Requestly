import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import rolesData from "../fixtures/resource/rolesData.json";

test.describe("Custodian Login", () => {
  const selector = new Selectors();
  const custodianData = rolesData.C[0][0];
  const email = custodianData.email;
  const password = custodianData.password;
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page, selector);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
  
 

});

  test("Logout", async ({ page }) => {
    await loginPage.logout();
    await expect(page).toHaveURL(/.*\/login$/);
  });



});


