import { Page } from "@playwright/test";
import { Selectors } from "../selectors";

export class LoginPage {
  private selector: Selectors["loginSelectors"]; 
  constructor(private page: Page,selectors:Selectors) {
    this.selector = selectors.loginSelectors;
  }
 
  async overAllAdmin() {
    await this.page.locator(this.selector.profileicon).click();
    await this.page.locator(this.selector.dropdown).getByText("Logout").click();
  }
  
}
