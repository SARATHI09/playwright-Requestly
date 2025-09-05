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
    await this.page.locator(this.selector.dropdown).getByText('Masters').click({force:true});

    console.log('???????????',process.env.BaseUrl! + '/masters')
    await expect(this.page).toHaveURL(process.env.BaseUrl! + '/masters');
    console.log('??',this.page.getByText('+ Add Company'))
    await this.page.getByText('+ Add Company').click();
    await this.page.getByText('Employee Master').click();
 

  }
  async logout() {
    await this.page.locator(this.selector.profileicon).click();
    await this.page.locator(this.selector.dropdown).getByText("Logout").click();
  }
  
}
