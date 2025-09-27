import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import activateDetails from "../fixtures/resource/activateDetails.json";
import custodianData from "../fixtures/resource/custodianData.json";
import { ReviewerPages } from "../pages/reviewerPages";
test.describe("Reviewer Login", () => {
  const selector = new Selectors();
  const reviewerName = custodianData.reviewerName;
  const reviewerUser = (activateDetails as Array<{ empName: string; email: string; password: string }>).find((u) => u.empName === reviewerName);
  const email = reviewerUser?.email ?? "";
  const password = reviewerUser?.password ?? "";
  let loginPage: LoginPage;
  let reviewer: ReviewerPages;
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    reviewer = new ReviewerPages(page, selector);
    loginPage = new LoginPage(page, selector);
    console.log("??",email);
    console.log("??",password);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
  });

  test("Logout", async ({ page }) => {
    await reviewer.switchToCustodianRole();
    await reviewer.searchAndOpenProjectGroup();
    await reviewer.searchAndOpenProject();
    await reviewer.verifyRequirementHeader();
    await reviewer.verifyAutoFetchedFields();
    await reviewer.downloadDocument();
  });
});
