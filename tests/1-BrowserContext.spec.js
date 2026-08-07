const { test ,expect} = require("@playwright/test");

/*
========================================================
PLAYWRIGHT - BROWSER CONTEXT & PAGE FIXTURE
========================================================

Fixture:
- A fixture is a ready-to-use object provided by Playwright to our test.
- Examples: { page }, { browser }, { context }

Browser Context:
- Think of a context as an isolated browser session.
- Each context has its own cookies, login/session, local storage, etc.
- Useful when we need multiple independent users/sessions.

--------------------------------------------------------
1. USING BROWSER + CONTEXT
--------------------------------------------------------
*/

test("First PW Test - Browser Context", async ({ browser }) => {

    // Create a new isolated browser session
    const context = await browser.newContext();

    // Create a new page/tab inside that session
    const page = await context.newPage();

    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle("Google");
});


/*
--------------------------------------------------------
2. USING PAGE FIXTURE DIRECTLY
--------------------------------------------------------

Why direct { page }?
- Playwright creates the context + page for us automatically.
- Less setup and cleaner code.
- Preferred for most normal UI test cases.
*/

//test.only → run only this test
test("Direct Page Fixture Test", async ({ page }) => {

    await page.goto("https://www.facebook.com");
});


/*
========================================================
WHEN TO USE WHAT?
========================================================

Normal UI test:
    { page }
    → Simple and preferred for most tests.

Need more session/browser control:
    { browser } → newContext() → newPage()
    → Useful for multiple users, separate sessions, etc.

Easy Remember:
    Normal Test     = page fixture
    Session Control = browser → context → page
========================================================
*/