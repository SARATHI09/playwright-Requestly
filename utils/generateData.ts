import { faker } from '@faker-js/faker';
import * as fs from "fs";
import * as path from "path";

export function writeJSON(filePath: string, data: any) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export const generateRandomString = (length: number): string => {
  return Math.random().toString(36).substring(2, length + 2);
};


export function generateMultipleEmployees(count=0) {
  return Array.from({ length: count }, () => generateData());
}

export function generateProjectGroupName(): string {
  const data = generateData();
  return `${data.empName} ${data.designation} Group`;
}

export function generateData() {
  const companyName = faker.company.name();
  let countryOptions =['Australia','Bangladesh','Brazil','China','India','Kenya','Malaysia','Philippines','Singapore','Sri Lanka','Tanzania','Uganda','United Arab Emirates','United States'];
  const country = countryOptions[Math.floor(Math.random() * countryOptions.length)];
  const fullName = faker.person.firstName();
  const empName = fullName.charAt(0).toUpperCase() + fullName.slice(1).toLowerCase();
  const email = `${empName.toLowerCase().replace(/\s+/g, '.')}${faker.number.int({ min: 100, max: 999 })}@yopmail.com`;
  const password = `${empName.split(' ')[0].charAt(0).toUpperCase()}${fullName.slice(1).toLowerCase()}@${faker.number.int({ min: 100, max: 999 })}`;
  let designationOptions= ["Trainee","Manager","Tester","Auditor","MD"];
  const designation = designationOptions[Math.floor(Math.random() * designationOptions.length)];
  const role= ["Project Creator","Reviewer","Custodian","Management","Overall Admin"]; 
  const roleSets = Math.random() < 0.2
    ? role[Math.floor(Math.random() * role.length)]
    : (() => {
        const shuffled = [...role].sort(() => Math.random() - 0.5);
        const count = Math.floor(Math.random() * (role.length - 1)) + 2;
        return shuffled.slice(0, count);
      })();
   return{
    companyName,
    country,
    empName,
    designation,
    email,
    password,
    roleSets
  }
}

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface RequirementData {
  title: string;
  priority: PriorityLevel;
  processCategory: string;
  department: string;
  dataRequirement: string;
}

export function generateRequirementData(): RequirementData {
  const priorityOptions: PriorityLevel[] = ['High','Medium','Low'];
  const title = `Req ${generateRandomString(6)}`;
  const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
  const processCategory = faker.commerce.department().toLowerCase();
  const department = faker.commerce.productAdjective().toLowerCase();
  const dataRequirement = faker.lorem.words({ min: 3, max: 7 });
  return { title, priority, processCategory, department, dataRequirement};
}

export interface ProjectCreationData {
  projectName: string;
  projectGroupName: string;
  description: string;
  companyName: string;
  teamMemberName: string;
}

export function generateProjectCreationData(options?: { companyName?: string; teamMemberName?: string; }): ProjectCreationData {
  const projectName = `Test Project ${faker.word.noun()} ${faker.number.int({ min: 100, max: 999 })}`;
  const projectGroupName = `Test Group ${faker.word.adjective()} ${faker.number.int({ min: 100, max: 999 })}`;
  const description = faker.lorem.sentence(20).slice(0, 240);
  const companyName = options?.companyName ?? 'Erdman and Sons';
  const teamMemberName = options?.teamMemberName ?? 'Aidan';
  return { projectName, projectGroupName, description, companyName, teamMemberName };
}
