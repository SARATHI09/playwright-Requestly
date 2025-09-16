import { Page, expect } from "@playwright/test";
import { Selectors } from "../selectors/index";
import type { RequirementData, ProjectCreationData } from "../utils/generateData";
import { generateRequirementData } from "../utils/generateData";
import rolesData from "../fixtures/resource/rolesData.json";
import activateDetails from "../fixtures/resource/activateDetails.json";
import projectCreatorData from "../fixtures/resource/projectCreator.json";
import { writeJSON } from "../utils/generateData";

export class ProjectCreatorPage {
  private login :Selectors["loginSelectors"]
  private selector: Selectors["projectCreatorSelectors"];
  private req: Selectors["requirementListSelectors"];
  private selectedCustodianName: string = '';
  selectedEscalation1Name: string = '';
  selectedProjectCreatorName: string = '';
  selectedRandomCompany: string = '';
  selectedReviewerName: string = '';
  constructor(private page: Page, selectors: Selectors) {
    this.selector = selectors.projectCreatorSelectors;
    this.req = selectors.requirementListSelectors;
    this.login = selectors.loginSelectors;  
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private selectRandomCompanyFromP(): string {
    // Read rolesData.json → P[] and extract all company values
    const companies = rolesData.P.map(item => item[0].company);
    const uniqueCompanies = [...new Set(companies)];
    // Pick one random company
    const randomIndex = Math.floor(Math.random() * uniqueCompanies.length);
    return uniqueCompanies[randomIndex];
  }

  private async selectTeamMember(): Promise<string> {
    const allEmpNames = activateDetails.map(item => item.empName);
    // Remove duplicates (unique only) - though there shouldn't be any
    const uniqueEmpNames = [...new Set(allEmpNames)];
    // Log the total count for debugging
    console.log(`Total empNames from activateDetails.json: ${uniqueEmpNames.length}`);
    console.log(`All empNames: ${uniqueEmpNames.join(', ')}`);
    // Shuffle the list to avoid repetition
    const shuffledEmpNames = this.shuffleArray(uniqueEmpNames);
    // Try each name in shuffled order until one succeeds
    for (const candidate of shuffledEmpNames) {
      try {
        console.log(`Trying to select team member: ${candidate}`);
        await this.page.getByRole('option', { name: candidate }).click();
        console.log(`Successfully selected team member: ${candidate}`);
        return candidate;
      } catch (error) {
        continue;
      }
    }
    throw new Error(`No valid team member found in dropdown. Tried all ${shuffledEmpNames.length} names: ${shuffledEmpNames.join(', ')}`);
  }
  private async selectCustodian(): Promise<string> {
    // Read from projectCreator.json C array (simpler structure)
    const allEmpNames = projectCreatorData.C.map(item => item.empName);
    // Remove duplicates (unique only)
    const uniqueEmpNames = [...new Set(allEmpNames)];
    // Shuffle the list randomly
    const shuffledEmpNames = this.shuffleArray(uniqueEmpNames);
    // Try each name in shuffled order
    for (const candidate of shuffledEmpNames) {
      try {
        await this.page.getByRole('option', { name: candidate }).click();
        return candidate;
      } catch (error) {
        continue;
      }
    }
    throw new Error(`No valid custodian found in dropdown. Tried: ${shuffledEmpNames.join(', ')}`);
  }

  private async selectReviewer(): Promise<string> {
    // Read from projectCreator.json R array (simpler structure)
    const allEmpNames = projectCreatorData.R.map(item => item.empName);
    // Remove duplicates (unique only)
    const uniqueEmpNames = [...new Set(allEmpNames)];
    // Exclude the custodian name if it was selected
    const filteredEmpNames = this.selectedCustodianName
      ? uniqueEmpNames.filter(name => name !== this.selectedCustodianName)
      : uniqueEmpNames;
    // Shuffle the list randomly
    const shuffledEmpNames = this.shuffleArray(filteredEmpNames);
    // Try each name in shuffled order
    for (const candidate of shuffledEmpNames) {
      try {
        await this.page.getByRole('option', { name: candidate }).click();
        // If click works → return that candidate
        return candidate;
      } catch (error) {
        // If fails → continue with next
        continue;
      }
    }
    // If none match, throw an error
    throw new Error(`No valid reviewer found in dropdown. Tried: ${shuffledEmpNames.join(', ')}`);
  }

  private async selectProjectCreator(): Promise<string> {
    // Read from projectCreator.json P array (simpler structure)
    const allEmpNames = projectCreatorData.P.map(item => item.empName);
    // Remove duplicates (unique only)
    const uniqueEmpNames = [...new Set(allEmpNames)];
    // Shuffle the list randomly
    const shuffledEmpNames = this.shuffleArray(uniqueEmpNames);
    // Try each name in shuffled order
    for (const candidate of shuffledEmpNames) {
      try {
        await this.page.getByRole('option', { name: candidate }).click();
        return candidate;
      } catch (error) {
        continue;
      }
    }
    throw new Error(`No valid project creator found in dropdown. Tried: ${shuffledEmpNames.join(', ')}`);
  }
  async selectDate(daysFromToday: number = 0) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromToday);
    const dateToClick = targetDate.getDate().toString();
    await this.page.getByText(dateToClick, { exact: true }).click();
  }

  async createProject(projectData: ProjectCreationData, options?: { selectNoRadio?: boolean }) {
    await this.page.locator(this.login.roleChange).click();
    await this.page.locator(this.login.dropdown).getByText('Project Creator').click();
    // Step 0: Project Info
    await this.page.getByText(this.selector.addProject).first().click();
    await expect(this.page).toHaveURL(/.*\/projects\/add\?step=0$/);

    await this.page.getByPlaceholder(this.selector.projectName).fill(projectData.projectName);
    // Select project group - click dropdown and then + Add new Project Group
    await this.page.getByRole('combobox').filter({ hasText: this.selector.projectGroup }).click();
    await this.page.getByText(this.selector.addNewProjectGroup).click();
    // Use provided project group name
    await this.page.getByPlaceholder(this.selector.projectGroupName).fill(projectData.projectGroupName);
    await this.page.getByText(this.selector.createProjectGroup).click();
    await expect(this.page.getByText("Succesfully created Project Group")).toBeVisible();
    // Select dates
    await this.page.getByRole('textbox', { name: this.selector.startDate }).click();
    await this.page.getByRole('button', { name: 'Today' }).click();
    await this.page.getByRole('textbox', { name: this.selector.endDate }).click();
    await this.selectDate(2);
    await this.page.getByPlaceholder(this.selector.projectDescription).fill(projectData.description);
    // Select random company from rolesData.json P[] array
    const randomCompany = this.selectRandomCompanyFromP();
    await this.page.getByRole('combobox').filter({ hasText: this.selector.company }).click();
    await this.page.getByRole('option', { name: randomCompany }).click();
    await this.page.getByText(this.selector.saveAndNext).click();
    await expect(this.page).toHaveURL(/.*\/projects\/\d+\?step=1$/);
    // Step 1: Project Team
    await this.page.getByText(this.selector.addPeople).nth(1).click();
    await this.page.getByRole('combobox').click();
    const projectCreatorName = await this.selectProjectCreator();
    this.selectedProjectCreatorName = projectCreatorName;
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
    await this.page.getByText(this.selector.submitButton).click();
    await expect(this.page).toHaveURL(/.*\/projects\/\d+\/requirements$/);
    await this.page.getByRole('tab', { name: 'Requirement List' }).click();
    // Click Add Requirement
    await this.page.getByRole('button', { name: 'Add Requirement' }).nth(1).click();
    const reqData = generateRequirementData();
    await this.addRequirementRandomly(reqData);
    await this.writeCustodianData(projectData, reqData);
  }
  async addRequirementRandomly(data: RequirementData) {
    await expect(this.page.getByText(this.req.headerProjectInfo)).toBeVisible();
    // Requirement Title
    await this.page.getByPlaceholder(this.req.requirementTitle).fill(data.title);
    // Priority dropdown
    await this.page.getByRole('combobox').filter({ hasText: this.req.priorityDropdown }).click();
    await this.page.getByRole('option', { name: data.priority }).click();
    // Due Date
    await this.page.getByRole('textbox', { name: this.req.dueDatePlaceholder }).first().click();
    await this.selectDate(1)
    // Process/Category
    await this.page.getByPlaceholder(this.req.processCategory).fill(data.processCategory);
    // Department
    await this.page.getByPlaceholder(this.req.department).fill(data.department);
    // Data Requirement
    await this.page.locator(this.req.dataRequirement).fill(data.dataRequirement);
    // Company
    await this.page.getByRole('combobox').filter({ hasText: this.req.companyDropdown }).click();
    const randomCompany = this.selectRandomCompanyFromP();
    this.selectedRandomCompany = randomCompany;
    await this.page.getByRole('option', { name: randomCompany }).click();
    // Custodian - use random selection from C array
    await this.page.getByRole('combobox').filter({ hasText: this.req.custodianDropdown }).click();
    const custodianName = await this.selectCustodian();
    this.selectedCustodianName = custodianName;
    // Reviewer - use random selection from R array
    await this.page.getByRole('combobox').filter({ hasText: this.req.reviewerDropdown }).click();
    const reviewerName = await this.selectReviewer();
    this.selectedReviewerName = reviewerName;
    // Reviewer Due Date
    await this.page.getByPlaceholder(this.req.reviewerDueDatePlaceholder).last().click();
    await this.page.getByText(String(data.reviewerDueDateDay ?? 15)).click();
    // Escalations - use the selected teamMemberName from activateDetails.json
    await this.page.getByRole('combobox').filter({ hasText: this.req.escalation1 }).click();
    const escalation1 = await this.selectTeamMember();
    this.selectedEscalation1Name = escalation1;
    // Click header Request button
    await this.page.getByRole('button', { name: this.req.requestButton }).click();
  }
  private async writeCustodianData(projectData: ProjectCreationData, reqData: RequirementData): Promise<void> {
    const custodianData = {
      projectName: projectData.projectName,
      projectGroupName: projectData.projectGroupName,
      description: projectData.description,
      randomCompany: this.selectedRandomCompany,
      projectCreatorName: this.selectedProjectCreatorName,
      title: reqData.title,
      priority: reqData.priority,
      processCategory: reqData.processCategory,
      department: reqData.department,
      dataRequirement: reqData.dataRequirement,
      custodianName: this.selectedCustodianName,
      reviewerName: this.selectedReviewerName,
      escalation1: this.selectedEscalation1Name

    };
    // Write to custodianData.json
    writeJSON("fixtures/resource/custodianData.json", custodianData);
  }
}
