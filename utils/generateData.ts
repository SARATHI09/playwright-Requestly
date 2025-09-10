import { faker } from '@faker-js/faker';
import * as fs from "fs";
import * as path from "path";

export function writeJSON(filePath: string, data: any) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
export const generateRandomEmail = (): string => {
  const randomStr = Math.random().toString(36).substring(7);
  return `testuser_${randomStr}@example.com`;
};

export const generateRandomString = (length: number): string => {
  return Math.random().toString(36).substring(2, length + 2);
};

export const toCamelCase = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, '');
}

export function generateMultipleEmployees(count=5) {
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
  const roleSets = Math.random() < 0.3
  ? role[Math.floor(Math.random() * role.length)] 
  : Array.from(
      new Set(
        Array.from({ length: Math.floor(Math.random() * (role.length - 1)) + 2 },
          () => role[Math.floor(Math.random() * role.length)]
        )
      )
    );
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
