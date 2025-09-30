import { Page,expect } from "@playwright/test";
import { Selectors } from "../selectors";

export class ManagementPages{

    constructor(private page:Page,private selectors:Selectors){
        this.selectors.editManagementSelectors
    }
    async switchToManagementRole(){
		await this.page.locator(this.selectors.loginSelectors.roleChange).click();
		try{
		await this.page.locator(this.selectors.loginSelectors.dropdown).getByText(this.selectors.editReviewerSelectors.roleOptionreviewer).click();
		await expect(this.page.locator(this.selectors.loginSelectors.roleChange)).toHaveText(this.selectors.editReviewerSelectors.roleOptionreviewer);
		}catch{
			console.log("??", "Dropdown not available");
		}
	}
}