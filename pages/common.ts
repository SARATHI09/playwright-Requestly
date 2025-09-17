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
  async clickProfileIcon() {
    await this.page.locator(this.selector.profileicon).click();
    await expect(this.page.getByRole('menuitem', { name: this.selector.myProfile })).toBeVisible();
  }
  async goToMyProfile() {
    await this.clickProfileIcon();
    await this.page.getByRole('menuitem', { name: this.selector.myProfile }).click();
  }
  async logout() {
    await this.clickProfileIcon();
    await this.page.getByRole('menuitem', { name: this.selector.logout }).click();
  }
  async roleSwitch(){
    await this.page.locator(this.selector.roleChange).click();
    await this.page.locator(this.selector.dropdown).getByText('Overall Admin').click();
    expect(this.page.locator(this.selector.roleChange)).toHaveText('Overall Admin');
    await Promise.all([ 
      this.page.locator(this.selector.profileicon).click(),
      expect(this.page.getByRole('menuitem', { name: 'Masters' })).toBeVisible(),
      this.page.getByRole('menuitem', { name: 'Masters' }).click({force:true}),
    ]);
    await this.page.waitForURL(process.env.BaseUrl! + '/masters') 
  }
  async activationEmail(yop:any){
    for (const loginData of yop){
      const{email,password}=loginData;
      await this.page.goto(process.env.YOPBaseURL!);
      console.log('??',email);
      await this.page.locator(this.selector.yopEmail).fill(email);
      await this.page.locator(this.selector.yopsubmit).click();
      await this.page.locator(this.selector.yopRefresh).click();
      await this.page.waitForTimeout(3000);
      const frame = this.page.frameLocator("#ifmail");

      await frame.locator("a[href*='verifyingEmail']").first().waitFor();
      const activationLink = await frame.locator("a[href*='verifyingEmail']").first().getAttribute("href");
      console.log("Found activation link:", activationLink);
      await this.page.goto(activationLink!);
      await this.page.getByPlaceholder(this.selector.password).fill(password);
      await this.page.getByPlaceholder(this.selector.conformPassword).fill(password);
      await this.page.getByText(this.selector.resetSubmit).click();
    }
  }
}
