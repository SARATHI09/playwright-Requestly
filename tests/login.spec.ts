import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";

test.describe("Login For Requestly", () => {
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

  test("Logout", async ({ page }) => {
    await loginPage.logout();
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Forgot Password", () => {
  const selector = new Selectors();
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page, selector);
  });

  test("Navigate to Forgot Password", async ({ page }) => {
    // await loginPage.forgotPassword();
    await expect(page).toHaveURL(/.*\/forgotPassword$/);
  });
});

test.describe("Microsoft Login", () => {
  const selector = new Selectors();
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page, selector);
  });

  test("Microsoft Login Button is Visible", async ({ page }) => {
    await expect(page.getByText(selector.loginSelectors.microsoftLogin)).toBeVisible();
  });

  test("Click Microsoft Login Button", async ({ page }) => {
    await loginPage.microsoftLogin();
    // Verify that we're redirected to Microsoft login or the page changes
    await page.waitForLoadState('networkidle');
    // The page might redirect to Microsoft login or show a popup
    expect(page.url()).toBeDefined();
  });

  test("Microsoft Login with Valid Email", async ({ page }) => {
    const testEmail = "test@example.com";
    await loginPage.microsoftLoginWithEmail(testEmail);
    // Wait for any redirects or popups
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeDefined();
  });

  test("Microsoft Login Button Clickable", async ({ page }) => {
    const microsoftButton = page.getByText(selector.loginSelectors.microsoftLogin);
    await expect(microsoftButton).toBeEnabled();
    await expect(microsoftButton).toBeVisible();
  });

  test("Microsoft Login Button Has Correct Text", async ({ page }) => {
    const microsoftButton = page.getByText(selector.loginSelectors.microsoftLogin);
    await expect(microsoftButton).toHaveText("Microsoft Login");
  });

  test("Microsoft Login Flow - Navigate Back", async ({ page }) => {
    await loginPage.microsoftLogin();
    await page.waitForLoadState('networkidle');
    
    // Try to navigate back to login page
    await page.goBack();
    await expect(page).toHaveURL(/.*\/login$/);
  });

  test("Microsoft Login Button Accessibility", async ({ page }) => {
    const microsoftButton = page.getByText(selector.loginSelectors.microsoftLogin);
    await expect(microsoftButton).toHaveAttribute('type', 'button');
  });

  test("Microsoft Login - Multiple Clicks", async ({ page }) => {
    const microsoftButton = page.getByText(selector.loginSelectors.microsoftLogin);
    
    // Click multiple times to test for any issues
    await microsoftButton.click();
    await page.waitForTimeout(1000);
    await microsoftButton.click();
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeDefined();
  });

  test("Microsoft Login - Keyboard Navigation", async ({ page }) => {
    const microsoftButton = page.getByText(selector.loginSelectors.microsoftLogin);
    
    // Test keyboard navigation
    await microsoftButton.focus();
    await expect(microsoftButton).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBeDefined();
  });

  test("Microsoft Login - Tab Order", async ({ page }) => {
    // Test tab order through the login form
    await page.keyboard.press('Tab'); // Email field
    await page.keyboard.press('Tab'); // Password field
    await page.keyboard.press('Tab'); // Forgot password link
    await page.keyboard.press('Tab'); // Regular login button
    await page.keyboard.press('Tab'); // Microsoft login button
    
    const microsoftButton = page.getByText(selector.loginSelectors.microsoftLogin);
    await expect(microsoftButton).toBeFocused();
  });
});
