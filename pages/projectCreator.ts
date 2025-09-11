import { Page, expect } from "@playwright/test";
import { Selectors } from "../selectors/index";
import { generateProjectGroupName } from "../utils/generateData";

export class ProjectCreatorPage {
  private selector: Selectors["projectCreatorSelectors"];
  private req: Selectors["requirementListSelectors"];
  
  constructor(private page: Page, selectors: Selectors) {
    this.selector = selectors.projectCreatorSelectors;
    this.req = selectors.requirementListSelectors;
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

    await this.page.locator(this.selector.reminderinfo).getByRole('combobox').click();
    await this.page.getByRole('option', { name: this.selector.dailyOption }).click();
    
    await this.page.locator(this.selector.escalation1info).getByRole('combobox').click();
    await this.page.getByRole('option', { name: this.selector.pastDueDaily }).click();
    
    await this.page.locator(this.selector.escalation2info).getByRole('combobox').click();
    await this.page.getByRole('option', { name: this.selector.pastDueDaily }).click();

    await this.page.locator(this.selector.escalation3info).getByRole('combobox').click();
    await this.page.getByRole('option', { name: this.selector.pastDueDaily }).click();

    await this.page.locator(this.selector.escalation4info).getByRole('combobox').click();
    await this.page.getByRole('option', { name: this.selector.pastDueDaily }).click();
    await this.page.getByText(this.selector.submitButton).click();
    await expect(this.page).toHaveURL(/.*\/projects\/\d+\/requirements$/);
    await this.page.getByRole('tab', { name: 'Requirement List' }).click();
    // await expect(this.page).toHaveURL(/.*\/projects\/\d+\/requirements$/);

    // Click Add Requirement
    await this.page.getByRole('button', { name: 'Add Requirement' }).nth(1).click();
    // await expect(this.page).toHaveURL(/.*\/requirements\/add$/);

// Verify header and presence of Project Info
    await expect(this.page.getByText(this.req.headerProjectInfo)).toBeVisible();

    // Requirement Title
    const randomTitle = `Req ${Math.random().toString(36).substring(2, 8)}`;
    await this.page.getByPlaceholder(this.req.requirementTitle).fill(randomTitle);

    // Priority dropdown pick random
    await this.page.getByRole('combobox').filter({ hasText: this.req.priorityDropdown }).click();
    const priorityOptions = this.req.priorityOptions ?? ['High','Medium','Low'];
    const random = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
    await this.page.getByRole('option', { name: random }).click();

    // Due Date (enable only)
    await this.page.getByRole('textbox', { name: this.req.dueDatePlaceholder }).first().click();
    await this.page.getByText('15').click();
    // Process/Category
    await this.page.getByPlaceholder(this.req.processCategory).fill(`cat-${Math.random().toString(36).substring(2,6)}`);

    // Department
    await this.page.getByPlaceholder(this.req.department).fill(`dept-${Math.random().toString(36).substring(2,6)}`);

    // Data Requirement
    await this.page.locator(this.req.dataRequirement).fill(`data-${Math.random().toString(36).substring(2,10)}`);

    // Company
    await this.page.getByRole('combobox').filter({ hasText: this.req.companyDropdown }).click();
    await this.page.getByRole('option').first().click();

    // Custodian
    await this.page.getByRole('combobox').filter({ hasText: this.req.custodianDropdown }).click();
    await this.page.getByRole('option').first().click();

    // Reviewer
    await this.page.getByRole('combobox').filter({ hasText: this.req.reviewerDropdown }).click();
    await this.page.getByRole('option').last().click();

    // Reviewer Due Date
    await this.page.getByPlaceholder(this.req.reviewerDueDatePlaceholder).last().click();
    await this.page.getByText('15').click();

    // Escalations
    await this.page.getByRole('combobox').filter({ hasText: this.req.escalation1 }).click();
    await this.page.getByRole('option').first().click();

    // await this.page.getByRole('combobox').filter({ hasText: this.req.escalation2 }).click();
    // await this.page.getByRole('option').first().click();

    // await this.page.getByRole('combobox').filter({ hasText: this.req.escalation3 }).click();
    // await this.page.getByRole('option').first().click();

    // await this.page.getByRole('combobox').filter({ hasText: this.req.escalation4 }).click();
    // await this.page.getByRole('option').first().click();

    // Click header Request button
    await this.page.getByRole('button', { name: this.req.requestButton }).click();
  }
}
