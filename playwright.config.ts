import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './tests/my-test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  expect: {timeout: 10000}, //assertions now have 10s instead of default 5
  testDir: './tests', //Only run tests found inside of 'tests' folder. This excludes 'tests-examples'
  /* Run tests in files in parallel */
  fullyParallel: true, //without this parallel execution would still happen but on a test *file* basis.
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'],['json', { outputFile: 'json-results/test-results.json' }], ['allure-playwright']],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.edgewordstraining.co.uk/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    //headless: false,
    //actionTimeout: 5000,
    launchOptions: {slowMo: 1000}, //Adds a 1 second delay between every step in a test. Good for debugging, but should be off when doing a large test run.
    actionTimeout: 20000,
    video: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      timeout: 60 * 1000, //My chromium instance seems to take 20 seconds to get going, so lets allow tests more time to execute if running on Chromium
      use: { ...devices['Desktop Chrome'],
              headless: false, //Oddly it only needs that extra time if running headed...
              person: 'bob'
            },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
              person: 'alice'
       },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
        /* These are 'simulations' of a mobile browser experience running via a desktop browser 
        There is experimental support for running against Chrome on a real android device:
        https://playwright.dev/docs/api/class-android
        */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPad (gen 5)'] },
    },


    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
