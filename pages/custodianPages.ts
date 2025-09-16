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
	    await projectText.click();
		await expect(this.page.getByText(custodianData.title)).toBeVisible();
		await this.page.getByText(custodianData.title).click();
		await expect(this.page.getByText(custodianData.projectName)).toBeVisible();
		await expect(this.page.getByText(this.selectors.headerStatusText)).toBeVisible();
	
	}

	async verifyRequirementHeader() {
		await expect(this.page.getByText(custodianData.title)).toBeVisible();
		await this.page.getByText(custodianData.title).click();
		await expect(this.page.getByText(custodianData.projectName)).toBeVisible();
		await expect(this.page.getByText(this.selectors.headerStatusText)).toBeVisible();
	}

	async verifyAutoFetchedFields() {
		await expect(this.page.getByText(this.selectors.priorityFieldLabel)).toBeVisible();
		await expect(this.page.getByText(custodianData.priority)).toBeVisible();
		await expect(this.page.getByText(this.selectors.titleFieldLabel)).toBeVisible();
		await expect(this.page.getByText(custodianData.title)).toBeVisible();
		await expect(this.page.getByText(this.selectors.processCategoryLabel)).toBeVisible();
		await expect(this.page.getByText(custodianData.processCategory)).toBeVisible();
		await expect(this.page.getByText(this.selectors.dataRequirementLabel)).toBeVisible();
		await expect(this.page.getByText(custodianData.dataRequirement)).toBeVisible();
		await expect(this.page.getByText(this.selectors.companyLabel)).toBeVisible();
		await expect(this.page.getByText(custodianData.randomCompany)).toBeVisible();
		await expect(this.page.getByText(this.selectors.custodianLabel)).toBeVisible();
		await expect(this.page.getByText(custodianData.custodianName)).toBeVisible();
		await expect(this.page.getByText(this.selectors.reviewerLabel)).toBeVisible();
		await expect(this.page.getByText(custodianData.reviewerName)).toBeVisible();
		await expect(this.page.getByText(this.selectors.escalation1Label)).toBeVisible();
		await expect(this.page.getByText(custodianData.escalation1)).toBeVisible();
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