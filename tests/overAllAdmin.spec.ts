import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";

test.describe("Login Tests", () => {
  const selector = new Selectors();
  const password = process.env.Password!;
  const email = process.env.Email!;
  const baseUrl = process.env.BaseUrl!;
  const expectedUrl = `${baseUrl}/projects`;
  
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page, selector);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(expectedUrl);
  });
  
  test("Company & Employee Creation", async ({ page }) => {
    await loginPage.roleSwitch();
  });

  test("logout", async ({ page }) => {
    await loginPage.logout();
    await expect(page).toHaveURL("/login");
  });
});
