import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import rolesData from "../fixtures/resource/rolesData.json";

test.describe("Reviewer Login", () => {
  const selector = new Selectors();
  const reviewerData = rolesData.R[0][0];
  const email = reviewerData.email;
  const password = reviewerData.password;
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
