import { Page } from "@playwright/test";
import { Selectors } from "../selectors";

export class LoginPage {
  private selector: Selectors["loginSelectors"]; 
  constructor(private page: Page,selectors:Selectors) {
    this.selector = selectors.loginSelectors;
  }
  async login(email: string, password: string) {
    console.log('??',email,password);
    console.log ('??',this.selector.email);
    await this.page.getByPlaceholder(this.selector.email).fill(email);
    
    await this.page.getByPlaceholder(this.selector.password).fill(password);
    await this.page.getByText(this.selector.login).click();
  }
  async logout() {
    await this.page.locator(this.selector.profileicon).click();
    await this.page.locator(this.selector.profileDropdown).getByText("Logout").click();
  }
}
