import { Page, expect } from "@playwright/test";
import { Selectors } from "../selectors/index";
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
    await this.page.getByText(this.selector.loginbtn).click();
  }
  async roleSwitch(){
    await this.page.locator(this.selector.roleChange).click();
    await this.page.locator(this.selector.dropdown).getByText('Overall Admin').click();
    await this.page.locator(this.selector.profileicon).click();
    console.log('????',this.selector.dropdown);
    await this.page.locator(this.selector.dropdown).getByText('Masters').click();
    await this.page.getByText('+ Add Company').click();
    await this.page.getByText('Employee Master').click();
    // console.log('????',await this.page.url());
    // await expect(this.page.locator('h1')).toHaveText('Masters'); 

  }
  async logout() {
    await this.page.locator(this.selector.profileicon).click();
    await this.page.locator(this.selector.dropdown).getByText("Logout").click();
  }
  
}
