import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/common";
import { ProjectCreatorPage } from "../pages/projectCreator";
import { Selectors } from "../selectors";
import rolesData from "../fixtures/resource/rolesData.json";
import { generateRequirementData, generateProjectCreationData } from "../utils/generateData";

test.describe("Project Creator Login", () => {
  const selector = new Selectors();
  const projectCreatorData = rolesData.P[0][0];
  const email = projectCreatorData.email;
  const password = projectCreatorData.password;
  let loginPage: LoginPage;
  let projectCreatorPage: ProjectCreatorPage;
  const baseUrl = process.env.BaseUrl!;
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
   loginPage = new LoginPage(page, selector);
    projectCreatorPage = new ProjectCreatorPage(page, selector);
    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*\/projects$/);
  });
  test("generate Reminders/Escalations automatically ? No", async ({ page }) => {
    const data = generateProjectCreationData();
    await projectCreatorPage.createProject(data, { selectNoRadio:  Math.random() > 0.5 });
    
  });
  test("Logout", async ({ page }) => {
    await loginPage.logout();
    await expect(page).toHaveURL(/.*\/login$/);
  });
});
