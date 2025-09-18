import { expect, Page } from "@playwright/test";
import { Selectors } from "../selectors";
import custodianData from "../fixtures/resource/custodianData.json";

export class CustodianPages {
	private selectors: Selectors["editCustodianSelectors"];
	private loginSelectors: Selectors["loginSelectors"];
	private req: Selectors["requirementListSelectors"];
	constructor(private page: Page, selectors: Selectors) {
		this.selectors = selectors.editCustodianSelectors;
		this.loginSelectors = selectors.loginSelectors;
		this.req = selectors.requirementListSelectors;
	}
	async switchToCustodianRole() {
		await this.page.locator(this.loginSelectors.profileicon).click();
		await this.page.locator(this.loginSelectors.roleChange).click();
		await this.page.locator(this.loginSelectors.dropdown).getByText(this.selectors.roleOptionCustodian).click();
		await expect(this.page.locator(this.loginSelectors.roleChange)).toHaveText(this.selectors.roleOptionCustodian);
	}
	async searchAndOpenProjectGroup() {
		const searchBox = this.page.locator("input[placeholder*='Search']");
		await searchBox.fill(custodianData.projectGroupName);
		await searchBox.press('Enter');
		await expect(this.page.getByText(custodianData.projectGroupName)).toBeVisible({ timeout: 10000 });
		await this.page.getByText(custodianData.projectGroupName, { exact: true }).first().click();
	}
	async searchAndOpenProject() {
		const searchBox = this.page.locator("input[placeholder*='Search']");
		await searchBox.fill(custodianData.projectName);
		await searchBox.press('Enter');
		const projectText = this.page.getByText(custodianData.projectName, { exact: true });
		await expect(projectText).toBeVisible({ timeout: 15000 });
		await projectText.scrollIntoViewIfNeeded();
	    await this.page.getByText(this.selectors.viewProjectButton).click();
		await expect(this.page).toHaveURL(/\/requirements(\?.*)?$/);
	}
	async verifyRequirementHeader() {
		await expect(this.page.getByText(custodianData.title)).toBeVisible();
		await this.page.getByText(custodianData.title).click();
		await expect(this.page.getByText(custodianData.projectName)).toBeVisible();
		// await expect(this.page.getByText(this.selectors.headerStatusRequest)).toBeVisible();
	}
	async verifyAutoFetchedFields() {
		await expect (this.page.getByRole('combobox').filter({ hasText: this.req.priorityDropdown })).toContainText(custodianData.priority);
		await expect(this.page.getByPlaceholder('Requirement Title')).toHaveValue(custodianData.title);
		await expect(this.page.getByPlaceholder(this.req.processCategory)).toHaveValue(custodianData.processCategory);
		await expect(this.page.getByRole('textbox', { name: this.req.dueDatePlaceholder }).first()).toHaveValue(custodianData.duedate);
		await expect(this.page.getByPlaceholder('Department')).toHaveValue(custodianData.department);
		await expect(this.page.locator(this.req.dataRequirement)).toHaveValue(custodianData.dataRequirement);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.req.companyDropdown })).toContainText(custodianData.randomCompany);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.req.custodianDropdown })).toContainText(custodianData.custodianName);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.req.reviewerDropdown })).toContainText(custodianData.reviewerName);
		await expect(this.page.getByPlaceholder(this.req.reviewerDueDatePlaceholder).last()).toHaveValue(custodianData.reviewerdate);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.req.escalation1 })).toContainText(custodianData.escalation1);
	}
	async addAttachment() {
		await this.page.getByRole('button', { name: this.selectors.attachmentButton }).first().click();
		await this.page.getByPlaceholder(this.selectors.attachmentDescription).fill(custodianData.dataRequirement);
		const filePath = "/home/finstein-emp/Documents/myProject/playwright/requestly/fixtures/resource/fileUpload/F-Edge-Bulk_Add_Requirement.xlsx";
		await this.page.setInputFiles(this.selectors.fileInput, filePath);
		await this.page.getByRole('button', { name: this.selectors.saveButton }).click();
	}
	async moveToQuery() {
	  // Get only the actual status text (Requested / Partial Submit / Query)
	  const statusLocator = this.page.locator('.statusText');
	  await statusLocator.waitFor({ state: 'visible', timeout: 10000 });
	
	  const statusValue = (await statusLocator.textContent())?.trim();
	  if (!statusValue) {
		throw new Error('Status value not found!');
	  }
	  // Decide which menu option to click based on status value
	  let menuOption: string;
	  if (statusValue.includes('Requested')) {
		menuOption = 'Move to Partial Submit';
	  } else if (statusValue.includes('Partial Submit')) {
		menuOption = 'Move to Query';
	  } else if (statusValue.includes('Query')) {
		menuOption = 'Move to Submit';
	  } else {
		throw new Error(`Unexpected status: ${statusValue}`);
	  }
		await this.page.getByPlaceholder(this.selectors.queryField).fill(custodianData.projectName);
		await this.page.locator(this.selectors.moreMenuButton).click();
		await this.page.getByRole('menuitem', { name: menuOption }).click();
		await this.page.getByRole('button', { name: this.selectors.confirmButton }).click();
		// await expect(this.page.getByText(this.selectors.toastSuccessText)).toBeVisible();
	  }
} 