import { Page } from "@playwright/test";
import { Selectors } from "../selectors";

export class AdminRole {
  private selector: Selectors["loginSelectors"]; 
  constructor(private page: Page,selectors:Selectors) {
    this.selector = selectors.loginSelectors;
  }
 
  async overAllAdmin() {
    await this.page.getByText('+ Add Company').click();
    await this.page.getByText('Employee Master').click();
  }
  
}
