// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  // Where Playwright looks for test files
  testDir: "./tests",

  // Retry failed tests 2 times
  retries: 2,

  // Maximum time allowed for one complete test
  timeout: 30 * 1000,

  // Maximum time Playwright waits for expect() assertions
  expect: {
    timeout: 5000,
  },

  use: {
    // Browser to run the tests in
    browserName: "chromium",

    // false = browser window will be visible
    headless: false,

    // Take screenshot for every test
    screenshot: "on",

    // Record trace for every test
    trace: "on",

    // Maximum time allowed for each action
    // Example: click(), fill(), check(), etc.
    actionTimeout: 10 * 1000,

    // Maximum time allowed for page navigation
    navigationTimeout: 30 * 1000,

    // Uncomment to use a custom browser size
    // viewport: { width: 1280, height: 720 },

    // Uncomment to run using a specific device
    // ...devices["iPhone 13"],

    // Uncomment to ignore HTTPS certificate errors
    // ignoreHTTPSErrors: true,

    // Uncomment to grant browser permissions
    // permissions: ["geolocation"],

    // Uncomment to record video only when test fails
    // video: "retain-on-failure",
  },

  // Generate HTML report after execution //allure
  reporter: [
    ["html"],
    ["allure-playwright"]
],
});

/* Notes:
Config
↓
Just a JavaScript object

defineConfig({...})
↓
Playwright configuration helper
*/






/*
===========================================================
PLAYWRIGHT CONFIG NOTES
===========================================================

1. testDir
-----------------------------------------------------------
Defines where Playwright looks for test files.

Example:
testDir: "./tests"

2. retries
-----------------------------------------------------------
Number of times Playwright retries a failed test.

retries: 2

Meaning:
Test fails
   ↓
Retry #1
   ↓
Retry #2
   ↓
If still failing → final failure

NOTE:
Retries are mainly useful in CI for temporary/flaky failures.


3. timeout
-----------------------------------------------------------
Maximum time allowed for ONE COMPLETE TEST.

timeout: 30 * 1000

30 * 1000 = 30 seconds

IMPORTANT:
This is the timeout for the whole test,
not for each individual action.


4. expect.timeout
-----------------------------------------------------------
Maximum time Playwright waits for an expect() assertion.

expect: {
    timeout: 5000
}

Example:

await expect(page.getByText("Success")).toBeVisible();

Playwright can wait up to 5 seconds for it.


5. browserName
-----------------------------------------------------------
Specifies which browser to use.

browserName: "chromium"

Other common values:
"chromium"
"firefox"
"webkit"


6. headless
-----------------------------------------------------------
Controls whether the browser UI is visible.

headless: false
→ Browser window is visible.

headless: true
→ Browser runs in the background.

NOTE:
For learning/debugging, false is useful.
For CI, true is commonly used.


7. screenshot
-----------------------------------------------------------
Controls when screenshots are captured.

screenshot: "on"
→ Screenshot for every test.

screenshot: "only-on-failure"
→ Screenshot only when test fails.

screenshot: "off"
→ No screenshots.


8. trace
-----------------------------------------------------------
Records Playwright trace information.

trace: "on"
→ Record trace for every test.

trace: "retain-on-failure"
→ Keep trace when test fails.

trace: "off"
→ No trace.

NOTE:
Trace is very useful for debugging failed tests.


9. actionTimeout
-----------------------------------------------------------
Maximum time allowed for an individual Playwright action.

Example:

await page.getByRole("button").click();

If the click cannot complete within this time,
Playwright fails the action.

It applies to actions such as:
click()
fill()
check()
selectOption()
etc.


10. navigationTimeout
-----------------------------------------------------------
Maximum time allowed for navigation.

Example:

await page.goto("https://example.com");

If navigation does not finish within the timeout,
Playwright fails it.


11. viewport
-----------------------------------------------------------
Controls browser viewport size.

Example:

viewport: {
    width: 1280,
    height: 720
}

NOTE:
This is useful when you want tests to run
with a fixed screen size.


12. devices
-----------------------------------------------------------
Allows testing using predefined device configurations.

Example:

...devices["iPhone 13"]

This can simulate things such as:
- Mobile viewport
- User agent
- Touch support
- Device scale factor

Example project:

projects: [
    {
        name: "Chrome",
        use: {
            ...devices["Desktop Chrome"]
        }
    },
    {
        name: "iPhone",
        use: {
            ...devices["iPhone 13"]
        }
    }
]


13. ignoreHTTPSErrors
-----------------------------------------------------------
Allows the browser to continue when a website has
HTTPS/SSL certificate errors.

Example:

ignoreHTTPSErrors: true

NOTE:
Normally leave this false.
Use it mainly for test environments with
self-signed or invalid certificates.


14. permissions
-----------------------------------------------------------
Grants browser permissions to the website.

Example:

permissions: ["geolocation"]

Useful for testing:
- Location
- Notifications
- Camera
- Microphone

Example:

permissions: ["geolocation", "notifications"]


15. video
-----------------------------------------------------------
Controls video recording of tests.

video: "retain-on-failure"
→ Keep video when test fails.

Other options include:
"on"
"off"
"retain-on-failure"


16. reporter
-----------------------------------------------------------
Defines how Playwright reports test results.

reporter: "html"
After execution, Playwright creates an HTML report.

Open it with:
npx playwright show-report


17. Custom Config File
-----------------------------------------------------------
You can create another config file.

Example:
playwright.config.mobile.js

Run:
npx playwright test --config=playwright.config.mobile.js


18. Projects
-----------------------------------------------------------
Projects allow the same tests to run with
different browsers or configurations.

Example:

projects: [
    {
        name: "Chromium",
        use: {
            browserName: "chromium"
        }
    },

    {
        name: "Firefox",
        use: {
            browserName: "firefox"
        }
    }
]

Run only one project: npx playwright test --project=Chromium

19. Workers
-----------------------------------------------------------
Workers control how many tests can run in parallel.

workers: 2 → Up to 2 tests can run at the same time.

workers: 1 → Tests run one at a time.

Command: npx playwright test --workers=2


20. Tags
-----------------------------------------------------------
Tags allow you to group tests and run only specific tests.

Example:

test("Login test @smoke", async ({ page }) => {
    ...
});

test("Order test @regression", async ({ page }) => {
    ...
});

Run only smoke tests:

npx playwright test --grep @smoke

Run only regression tests: --grep keywords are im to put tags

npx playwright test --grep @regression


===========================================================
IMPORTANT TIMEOUT DIFFERENCE
===========================================================

timeout
→ Maximum time for the COMPLETE TEST.

actionTimeout
→ Maximum time for ONE ACTION.

navigationTimeout
→ Maximum time for ONE NAVIGATION.

expect.timeout
→ Maximum time for ONE EXPECT ASSERTION.


Example:

Test
 ├── page.goto()       → navigationTimeout
 ├── button.click()    → actionTimeout
 ├── expect(...)       → expect.timeout
 └── entire test       → timeout


===========================================================
COMMON COMMANDS
===========================================================

Run all tests: npx playwright test

Run a specific test: npx playwright test tests/example.spec.js

Run with browser visible: npx playwright test --headed

Open Playwright UI: npx playwright test --ui

Open HTML report: npx playwright show-report

Run a specific project: npx playwright test --project=Chromium

Run using another config: npx playwright test --config=playwright.config.mobile.js

*/


/*
20. Allure Reporting
-----------------------------------------------------------
Allure generates a detailed visual report of test execution.

Install Allure Playwright:

npm install -D allure-playwright


Add to playwright.config.js:

reporter: [
    ["html"],
    ["allure-playwright"]
]


Run tests: npx playwright test

→ Test results are stored in the "allure-results" folder.


Open Allure report directly: npx allure serve allure-results

→ Generates the report and opens it in the browser.


Generate the report manually: npx allure generate allure-results --clean

→ Creates the "allure-report" folder.


Open the generated report: npx allure open allure-report

Quick flow:

Run tests
   ↓
allure-results
   ↓
npx allure serve allure-results
   ↓
Allure Report
*/


/*
21. NPM Scripts
-----------------------------------------------------------
NPM scripts are shortcuts for frequently used commands.

Example:

"test": "playwright test"

Run: npm test


For custom scripts:

"test:ui": "playwright test --ui"

Run: npm run test:ui


General syntax: npm run <script-name>
*/