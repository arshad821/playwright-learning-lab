/*
===========================================================
CUCUMBER.JS + PLAYWRIGHT — PLAYWRIGHT-SPECIFIC NOTES
===========================================================

1. Playwright Page in Cucumber
-----------------------------------------------------------
Unlike a normal Playwright test, Cucumber does not
automatically provide:

    async ({ page }) => { }

We need to create/manage the Playwright page ourselves,
usually through Cucumber hooks / World.

-----------------------------------------------------------

2. Cucumber World
-----------------------------------------------------------
The World can be used to store Playwright objects that
need to be shared between steps.

Example:

this.page

Then different step definitions can use:

await this.page.goto(...);
await this.page.locator(...).click();

-----------------------------------------------------------

3. Browser / Context / Page
-----------------------------------------------------------
With Cucumber + Playwright, we normally manage:

Browser
   ↓
BrowserContext
   ↓
Page

Example:

this.browser = await chromium.launch();
this.context = await this.browser.newContext();
this.page = await this.context.newPage();

-----------------------------------------------------------

4. Before Hook
-----------------------------------------------------------
Used to create Playwright setup before a scenario.

Example:

Before(async function () {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
});

-----------------------------------------------------------

5. After Hook
-----------------------------------------------------------
Used to clean up Playwright resources after a scenario.

Example:

After(async function () {
    await this.browser.close();
});

IMPORTANT:
If we create the browser/context/page ourselves,
we are responsible for cleaning them up.

-----------------------------------------------------------

6. Playwright Assertions
-----------------------------------------------------------
Cucumber does NOT provide Playwright assertions.

We can still use:

import { expect } from "@playwright/test";

Example:

await expect(this.page.getByText("Login Successful"))
    .toBeVisible();

-----------------------------------------------------------

7. Page Object Model
-----------------------------------------------------------
Cucumber steps should ideally call Page Object methods
instead of putting all Playwright locators directly
inside step definitions.

Example:

When("I login", async function () {
    await this.loginPage.login(username, password);
});

Step Definition
      ↓
Page Object
      ↓
Playwright

-----------------------------------------------------------

8. Sharing Page Objects
-----------------------------------------------------------
If using POM, Page Objects can be created using the
same Playwright page.

Example:

this.loginPage = new LoginPage(this.page);
this.dashboardPage = new DashboardPage(this.page);

-----------------------------------------------------------

9. Cucumber World vs Playwright Fixture
-----------------------------------------------------------
Normal Playwright:

test("login", async ({ page }) => {
    ...
});

Cucumber:

Before(async function () {
    this.page = await this.context.newPage();
});

So:

Playwright Test → fixtures manage page

Cucumber → we commonly manage page through World/hooks

-----------------------------------------------------------

10. IMPORTANT MENTAL MODEL
-----------------------------------------------------------

Cucumber
    ↓
Step Definition
    ↓
Page Object
    ↓
Playwright Page
    ↓
Browser


===========================================================
ONLY LEARN THESE NEW PARTS
===========================================================

✔ Browser lifecycle
✔ Context lifecycle
✔ Page lifecycle
✔ Cucumber World
✔ Hooks + Playwright
✔ Sharing page between steps
✔ Sharing Page Objects
✔ Playwright assertions inside Cucumber

Everything else about Cucumber you already know.
===========================================================
*/