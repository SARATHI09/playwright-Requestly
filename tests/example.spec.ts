import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { Selectors } from "../selectors";
import rolesData from "../fixtures/resource/rolesData.json";

test.describe("Example - Complete Login Flow", () => {
  const selector = new Selectors();
  const projectCreatorData = rolesData.P[0][0];
  const email = projectCreatorData.email;
  const password = projectCreatorData.password;
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page, selector);
  });

  test("Complete Login Flow - Project Creator", async ({ page }) => {
    // Step 1: Login with Project Creator credentials
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
    
    // Step 2: Verify we're on the projects page
    await expect(page.getByText("Project Groups")).toBeVisible();
    await expect(page.getByText("Project Creator")).toBeVisible();
    
    // Step 3: Click profile icon
    await loginPage.clickProfileIcon();
    await expect(page.getByRole('menuitem', { name: 'My Profile' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
    
    // Step 4: Go to My Profile
    await loginPage.goToMyProfile();
    // Note: Profile page URL may vary, so we just verify we navigated away from projects
    expect(page.url()).not.toContain('/projects');
    
    // Step 5: Navigate back to projects for logout
    await page.goto("/projects");
    await expect(page).toHaveURL(/.*\/projects$/);
    
    // Step 6: Logout
    await loginPage.logout();
    await expect(page).toHaveURL(/.*\/login$/);
  });

  test("Profile Icon Functionality", async ({ page }) => {
    // Login first
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
    
    // Test profile icon click
    await loginPage.clickProfileIcon();
    
    // Verify dropdown menu is visible
    await expect(page.getByRole('menuitem', { name: 'My Profile' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
    
    // Click outside to close dropdown
    await page.click('body');
    
    // Logout
    await loginPage.logout();
    await expect(page).toHaveURL(/.*\/login$/);
  });

  test("My Profile Navigation", async ({ page }) => {
    // Login first
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
    
    // Navigate to My Profile
    await loginPage.goToMyProfile();
    
    // Verify we're on a different page (not projects)
    expect(page.url()).not.toContain('/projects');
    
    // Navigate back to projects
    await page.goto("/projects");
    await expect(page).toHaveURL(/.*\/projects$/);
    
    // Logout
    await loginPage.logout();
    await expect(page).toHaveURL(/.*\/login$/);
  });

  test("Logout Functionality", async ({ page }) => {
    // Login first
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
    
    // Verify we're logged in
    await expect(page.getByText("Project Creator")).toBeVisible();
    
    // Logout
    await loginPage.logout();
    
    // Verify we're back on login page
    await expect(page).toHaveURL(/.*\/login$/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });
});
