import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import rolesData from "../fixtures/resource/rolesData.json";

test.describe("Management Login", () => {
  const selector = new Selectors();
  const managementData = rolesData.M[0][0];
  const email = managementData.email;
  const password = managementData.password;
  let loginPage: LoginPage;
  
  test.afterEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page, selector);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projectLevelDashboard$/);
  });
  
  test("Logout", async ({ page }) => {
    await loginPage.logout();
    await expect(page).toHaveURL(/.*\/login$/);
  });
});
