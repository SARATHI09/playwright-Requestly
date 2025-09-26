import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import activateDetails from "../fixtures/resource/activateDetails.json";
import custodianData from "../fixtures/resource/custodianData.json";
test.describe("Reviewer Login", () => {
  const selector = new Selectors();
  const reviewerName = custodianData.reviewerName;
  const reviewerUser = (activateDetails as Array<{ empName: string; email: string; password: string }>).find((u) => u.empName === reviewerName);
  const email = reviewerUser?.email ?? "";
  const password = reviewerUser?.password ?? "";
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
