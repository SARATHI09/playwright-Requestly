import { Page,expect } from "@playwright/test";
import { Selectors } from "../selectors";
import custodianData from "../fixtures/resource/custodianData.json";

export class ReviewerPages {

    constructor(private page: Page, private selectors:Selectors){
        this.selectors.editReviewerSelectors
        this.selectors.loginSelectors
        this.selectors.requirementListSelectors
    }
    async switchToCustodianRole() {
		await this.page.locator(this.selectors.loginSelectors.profileicon).click();
		await this.page.locator(this.selectors.loginSelectors.roleChange).click();
		try{
		await this.page.locator(this.selectors.loginSelectors.dropdown).getByText(this.selectors.editReviewerSelectors.roleOptionreviewer).click();
		await expect(this.page.locator(this.selectors.loginSelectors.roleChange)).toHaveText(this.selectors.editReviewerSelectors.roleOptionreviewer);
		}catch{
			console.log("??", "Dropdown not available");
		}
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
	    await this.page.getByText(this.selectors.editReviewerSelectors.viewProjectButton).click();
		await expect(this.page).toHaveURL(/\/requirements(\?.*)?$/);
	}
    async verifyRequirementHeader() {
		await expect(this.page.getByText(custodianData.title)).toBeVisible();
		await this.page.getByText(custodianData.title).click();
		await expect(this.page.getByText(custodianData.projectName)).toBeVisible();
		// await expect(this.page.getByText(this.selectors.headerStatusRequest)).toBeVisible();
	}
    async verifyAutoFetchedFields() {
		await expect (this.page.getByRole('combobox').filter({ hasText: this.selectors.requirementListSelectors.priorityDropdown })).toContainText(custodianData.priority);
		await expect(this.page.getByPlaceholder('Requirement Title')).toHaveValue(custodianData.title);
		await expect(this.page.getByPlaceholder(this.selectors.requirementListSelectors.processCategory)).toHaveValue(custodianData.processCategory);
		await expect(this.page.getByRole('textbox', { name: this.selectors.requirementListSelectors.dueDatePlaceholder }).first()).toHaveValue(custodianData.duedate);
		await expect(this.page.getByPlaceholder('Department')).toHaveValue(custodianData.department);
		await expect(this.page.locator(this.selectors.requirementListSelectors.dataRequirement)).toHaveValue(custodianData.dataRequirement);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.selectors.requirementListSelectors.companyDropdown })).toContainText(custodianData.randomCompany);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.selectors.requirementListSelectors.custodianDropdown })).toContainText(custodianData.custodianName);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.selectors.requirementListSelectors.reviewerDropdown })).toContainText(custodianData.reviewerName);
		await expect(this.page.getByPlaceholder(this.selectors.requirementListSelectors.reviewerDueDatePlaceholder).last()).toHaveValue(custodianData.reviewerdate);
		await expect(this.page.getByRole('combobox').filter({ hasText: this.selectors.requirementListSelectors.escalation1 })).toContainText(custodianData.escalation1);
	}
    async downloadDocument() {
        const downloadButtons = await this.page.locator('i.anticon.anticon-download').all();
        const downloadedFiles: string[] = []; 
        for (const button of downloadButtons) {
            const [download] = await Promise.all([
                this.page.waitForEvent("download", { timeout: 30000 }),
                button.click()
            ]); 

            const suggestedName = download.suggestedFilename();
            const filePath = `downloads/${suggestedName}`;
            await download.saveAs(filePath);
            downloadedFiles.push(filePath);
        }

        return downloadedFiles; 
    }


}