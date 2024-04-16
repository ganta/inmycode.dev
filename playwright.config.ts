import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Look for test files in the "tests" directory, relative to this configuration file. */
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : "50%",

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], [process.env.CI ? "dot" : "list"]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:4321",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "Firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "Safari",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Microsoft Edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },

    /* Test against mobile viewports. */
    {
      name: "Android Chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "iOS Safari",
      use: { ...devices["iPhone 14"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run start",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
