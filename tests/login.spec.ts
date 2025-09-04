import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import { Selectors } from "../selectors";

test.describe("Login Tests", () => {
  const selector = new Selectors();
  const password = process.env.Password!;
  const email = process.env.Email!;
  const baseUrl = process.env.BaseUrl!;
  const expectedUrl = `${baseUrl}/projects`;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const loginPage = new LoginPage(page,selector); 
    await loginPage.login(email, password);

    await expect(page).toHaveURL(expectedUrl);
  });

  test("logout", async ({ page }) => {
    const loginPage = new LoginPage(page,selector); 
    await loginPage.logout();
    await expect(page).toHaveURL("/login");
  });
});
