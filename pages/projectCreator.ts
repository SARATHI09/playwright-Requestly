import { Page, expect } from "@playwright/test";
import { Selectors } from "../selectors/index";
import { generateProjectGroupName } from "../utils/generateData";

export class ProjectCreatorPage {
  private selector: Selectors["projectCreatorSelectors"];
  
  constructor(private page: Page, selectors: Selectors) {
    this.selector = selectors.projectCreatorSelectors;
  }

  async createProject(projectData: any, options?: { selectNoRadio?: boolean }) {
    // Step 0: Project Info
    await this.page.getByText(this.selector.addProject).click();
    await expect(this.page).toHaveURL(/.*\/projects\/add\?step=0$/);
    
    await this.page.getByPlaceholder(this.selector.projectName).fill(projectData.projectName);
    
    // Select project group - click dropdown and then + Add new Project Group
    await this.page.getByRole('combobox').filter({ hasText: this.selector.projectGroup }).click();
    await this.page.getByText(this.selector.addNewProjectGroup).click();
    
    // Generate random project group name and create it
    const randomGroupName = generateProjectGroupName();
    await this.page.getByPlaceholder(this.selector.projectGroupName).fill(randomGroupName);
    await this.page.getByText(this.selector.createProjectGroup).click();
    await expect(this.page.getByText("Succesfully created Project Group")).toBeVisible();
    
    // Select dates
    await this.page.getByRole('textbox', { name: this.selector.startDate }).click();
    await this.page.getByRole('button', { name: 'Today' }).click();
    
    await this.page.getByRole('textbox', { name: this.selector.endDate }).click();
    await this.page.getByText('15').click();
    
    await this.page.getByPlaceholder(this.selector.projectDescription).fill(projectData.description);
    
    await this.page.getByRole('combobox').filter({ hasText: this.selector.company }).click();
    await this.page.getByRole('option', { name: projectData.companyName }).click();
    
    await this.page.getByText(this.selector.saveAndNext).click();
    await expect(this.page).toHaveURL(/.*\/projects\/\d+\?step=1$/);

    // Step 1: Project Team
    await this.page.getByText(this.selector.addPeople).nth(1).click();
    await this.page.getByRole('combobox').click();
    await this.page.getByRole('option', { name: projectData.teamMemberName }).click();
    await this.page.getByRole('button', { name: this.selector.addTeamMember }).nth(1).click();
    await expect(this.page.getByText('Project Team added succesfully')).toBeVisible();
    
    await this.page.getByText(this.selector.nextButton).click();
    await expect(this.page).toHaveURL(/.*\/projects\/\d+\?step=2$/);

    // Step 2: Escalation Info
    // Optionally click the "No" radio based on caller's intent
    if (options?.selectNoRadio) {
      await this.page.getByRole('radio', { name: this.selector.reminderEscalationNo }).click();
    }

    await this.page.locator('#escalation_remainderId').getByRole('combobox').click();
    await this.page.getByRole('option', { name: this.selector.dailyOption }).click();
    
    await this.page.locator('#escalation_escalation1Id').getByRole('combobox').click();
    await this.page.getByRole('option', { name: this.selector.pastDueDaily }).click();
    
    await this.page.getByText(this.selector.submitButton).click();
    await expect(this.page).toHaveURL(/.*\/projects\/\d+\/requirements$/);
  }
}
