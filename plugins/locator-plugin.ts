import { Locator } from '@playwright/test';

export async function click(locator: Locator, ...args: any[]): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await locator.click(...args);
}

export async function fill(locator: Locator, value: string, ...args: any[]): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await locator.fill(value, ...args);
}