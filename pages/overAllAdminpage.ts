import { Page } from "@playwright/test";
import { writeJSON } from "../utils/generateData";
import { Selectors } from "../selectors";
import { generateMultipleEmployees } from "../utils/generateData";

export class AdminRole {
  private company: Selectors["empCreation"]; 
  private selector: Selectors["loginSelectors"]; 
  constructor(private page: Page,selectors:Selectors) {
    this.company = selectors.empCreation;
  }
 
  async overAllAdmin(data :any) {
    let rolesData: any = { P: [], C: [], R: [], O: [], M: [] };
    let details: any[] = [];
     let projectCreatorData: any = { P: [], C: [], R: [], O: [], M: [] }; 
    const {companyName,country}=data
    await this.page.getByText('+ Add Company').click();
    await this.page.getByPlaceholder('Company Name').fill(companyName);
    await this.page.locator(this.company.country).nth(1).click();
    await this.page.getByRole("option",{ name:country}).click();
    await this.page.getByText('Save').click();
    // await this.page.getByText('Cancel').click();

    const employees = generateMultipleEmployees();
    for (const emp of employees) {

      const {empName,designation,email,roleSets,password}=emp
      // await this.page.reload();  
      await this.page.getByText('Employee Master').click();
      await this.page.getByRole('button',{name:'+ Add Employee'}).click();
      await this.page.getByPlaceholder('Employee Name').fill(empName);
      await this.page.locator(this.company.empCompanyName).nth(1).click();
      await this.page.getByRole("option", { name: companyName }).click();
      await this.page.getByPlaceholder('Designation').fill(designation);
      await this.page.getByPlaceholder('Email').fill(email);
      
      await this.page.getByText('Role').nth(2).click();
      const roleList = Array.isArray(roleSets) ? roleSets : [roleSets];
      console.log ('??',roleList)
      for (const role of roleList) {
          await this.page.getByRole("option").filter({ hasText: role }).click();
        }
      await this.page.getByText('Save').click();

      const userDetails = { email, password };
      details.push(userDetails);
      const empObj = {
        company: companyName,
        country,
        empName,
        designation,
        email,
        password,
        role: roleSets,
      };
      const roleMap: any = {
        "Project Creator": "P",
        "Custodian": "C",
        "Reviewer": "R",
        "Overall Admin": "O",
        "Management": "M",
      };

      const roleArray = Array.isArray(roleSets) ? roleSets : [roleSets];
      const firstRole = roleArray[0];
      const key = roleMap[firstRole];
      if (key && rolesData[key]) {
        rolesData[key].push(empObj); 
      }

      for (const role of roleArray) {
        const key = roleMap[role];
        if (key && rolesData[key]) {
          rolesData[key].push(empObj);
        }

        if (key && projectCreatorData[key]) {
          projectCreatorData[key].push({
            empName,
            company: companyName
          });
        }
    }
    writeJSON("fixtures/resource/rolesData.json",rolesData );
    writeJSON("fixtures/resource/activateDetails.json", details);
    writeJSON("fixtures/resource/projectCreator.json", projectCreatorData);
  }
  
}
}