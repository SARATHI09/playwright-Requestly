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

  async microsoftLogin() {
    await this.page.getByText(this.selector.microsoftLogin).click();
    // Wait for Microsoft login page to load
    await this.page.waitForLoadState('networkidle');
  }
  async microsoftLoginWithEmail(email: string) {
    await this.page.getByText(this.selector.microsoftLogin).click();
    // Wait for Microsoft login page to load
    await this.page.waitForLoadState('networkidle');
    // Fill email if on Microsoft login page
    try {
      await this.page.getByPlaceholder('Email, phone, or Skype').fill(email);
      await this.page.getByText('Next').click();
    } catch (error) {
      console.log('Microsoft login page not loaded or different structure');
    }
  }
  async clickProfileIcon() {
    await this.page.getByText(this.selector.profileIconText).click();
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
    await expect(this.page.locator(this.selector.roleChange)).toHaveText('Overall Admin');
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
