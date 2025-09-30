import { Page,expect } from "@playwright/test";
import { Selectors } from "../selectors";
import { CustodianPages } from "./custodianPages";	
import custodianData from "../fixtures/resource/custodianData.json";

export class ManagementPages{
	private custodian :CustodianPages
    constructor(private page:Page,private selectors:Selectors){
        this.selectors.editManagementSelectors
		this.selectors.editReviewerSelectors
        this.selectors.loginSelectors
        this.selectors.requirementListSelectors
		this.selectors.editCustodianSelectors
		this.custodian=new CustodianPages(page,selectors);
    }
    async switchToManagementRole(){
		await this.page.locator(this.selectors.loginSelectors.roleChange).click();
		try{
		await this.page.locator(this.selectors.loginSelectors.dropdown).getByText(this.selectors.editManagementSelectors.role).click();
		await expect(this.page.locator(this.selectors.loginSelectors.roleChange)).toHaveText(this.selectors.editManagementSelectors.role);
		}catch{
			console.log("??", "Dropdown not available");
		}
        await this.page.getByRole('combobox').filter({hasText:this.selectors.editManagementSelectors.projectChangefield}).click({force:true});
		await this.page.getByRole('option', { name: this.selectors.editManagementSelectors.project }).click({ force: true });

	}
	async projectRequirementList(){
		await this.custodian.searchAndOpenProjectGroup();
		await this.custodian.searchAndOpenProject();
		await this.page.getByRole('tab', { name: 'Requirement List' }).click();
		await this.custodian.verifyRequirementHeader();
		await this.custodian.verifyAutoFetchedFields();
	}

}