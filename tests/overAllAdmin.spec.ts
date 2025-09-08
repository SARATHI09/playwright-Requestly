import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { AdminRole } from "../pages/overAllAdminpage";
import { Selectors } from "../selectors";
import { generateData } from "../utils/generateData";
import detail from "../fixtures/resource/activateDetails.json"

test.describe("Login Tests", () => {
  const selector = new Selectors();
  const password = process.env.Password!;
  const email = process.env.Email!;
  const baseUrl = process.env.BaseUrl!;
  const expectedUrl = `${baseUrl}/projects`;

  let loginPage: LoginPage;
  let adminrole: AdminRole;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page, selector);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(expectedUrl);
  });

  test("Company & Employee Creation", async ({ page }) => {
    adminrole = new AdminRole(page, selector);
    await loginPage.roleSwitch();
    const data = generateData();
    await adminrole.overAllAdmin(data);
  });
  
  test("Activation Email", async ({ page }) => {
    let yop = detail;
    await loginPage.activationEmail(yop);
  });

  test("logout", async ({ page }) => {
    await loginPage.logout();
    await expect(page).toHaveURL("/login");
  });
});
