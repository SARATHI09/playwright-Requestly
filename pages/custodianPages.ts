import { expect, Page } from "@playwright/test";
import { Selectors } from "../selectors";
import custodianData from "../fixtures/resource/custodianData.json";

export class CustodianPages {
	private selectors: Selectors["editCustodianSelectors"];
	private loginSelectors: Selectors["loginSelectors"];
	constructor(private page: Page, allSelectors: Selectors) {
		this.selectors = allSelectors.editCustodianSelectors;
		this.loginSelectors = allSelectors.loginSelectors;
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
		await expect(this.page.getByText(this.selectors.headerStatusText)).toBeVisible();
	}

	private async expectValueNextToLabel(labelText: string, expectedValue: string) {
		// Use only filter(hasText) to assert that a single visible container holds both label and value
		const containers = this.page.locator('form, .ant-form, .ant-row, .ant-col, .ant-space, .ant-form-item, div');
		const row = containers
			.filter({ hasText: labelText })
			.filter({ hasText: expectedValue })
			.first();
		await expect(row).toBeVisible({ timeout: 10000 });
	}



	async verifyAutoFetchedFields() {
		await this.expectValueNextToLabel(this.selectors.priorityFieldLabel, custodianData.priority);
		await this.expectValueNextToLabel(this.selectors.titleFieldLabel, custodianData.title);
		await this.expectValueNextToLabel(this.selectors.processCategoryLabel, custodianData.processCategory);
		await this.expectValueNextToLabel('Department', custodianData.department);
		await this.expectValueNextToLabel(this.selectors.dataRequirementLabel, custodianData.dataRequirement);
		await this.expectValueNextToLabel(this.selectors.companyLabel, custodianData.randomCompany);
		await this.expectValueNextToLabel(this.selectors.custodianLabel, custodianData.custodianName);
		await this.expectValueNextToLabel(this.selectors.reviewerLabel, custodianData.reviewerName);
		await this.expectValueNextToLabel(this.selectors.escalation1Label, custodianData.escalation1);
	}

	async addAttachment() {
		await this.page.getByRole('button', { name: this.selectors.attachmentButton }).click();
		await this.page.getByPlaceholder(this.selectors.attachmentDescription).fill(custodianData.description);
		const filePath = "/home/finstein-emp/Documents/myProject/playwright/requestly/fixtures/resource/fileUpload/F-Edge-Bulk_Add_Requirement.xlsx";
		await this.page.setInputFiles(this.selectors.fileInput, filePath);
		await this.page.getByRole('button', { name: this.selectors.saveButton }).click();
	}

	async moveToQuery() {
		await this.page.getByPlaceholder(this.selectors.queryField).fill(custodianData.projectName);
		await this.page.locator(this.selectors.moreMenuButton).click();
		await this.page.getByRole('menuitem', { name: this.selectors.moveToQueryOption }).click();
		await this.page.getByRole('button', { name: this.selectors.confirmButton }).click();
		await expect(this.page.getByText(this.selectors.toastSuccessText)).toBeVisible();
	}
} 