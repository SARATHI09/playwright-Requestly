import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config(); 

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,
  workers: 1, 
  reporter: 'html',

  timeout: 100000, 
  use: {
    baseURL: process.env.BaseUrl,
    
    navigationTimeout: 30000,  
    actionTimeout: 15000,
    headless: false,

    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 500, 
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },  
    },
  ],

});
