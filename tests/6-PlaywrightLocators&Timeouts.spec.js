const { test ,expect} = require("@playwright/test");

test("PW Specific Locators Test", async ({ page }) => {


    const baseURL = "https://rahulshettyacademy.com/angularpractice/";
   
    await page.goto(baseURL);

    //1. Using getByLabel() to locate the checkbox by its label text (if text is inside a <label> element associated)
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").check();
    // Using getByLabel() to locate the dropdown by its label text and select an option by its visible text
    await page.getByLabel("Gender").selectOption("Female");
   
    // 2. By role — buttons, links, headings, etc.
    await page.getByRole("button", { name: "Submit" }).click();
    

    // 3. By placeholder — input fields with a placeholder
    await page.getByPlaceholder("Password").fill("password123");

    // 4. By text — visible text
    const successMessage = await page.getByText("Success! The Form has been submitted successfully!.").textContent();
    console.log(successMessage);
    //5second default for expect timeout, can be overridden by passing timeout in options
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout: 8000});
    // 5. By alt text — images
    await page.getByAltText("Logo").click();
    // 6. By title — elements with title attribute
    await page.getByTitle("Close").click();

    await page.getByRole("link", { name: "Shop" }).click();
    //filtering the product card with specific text and clicking the Add button inside it
    await page.locator("app-card").filter({ hasText: "Blackberry" }).locator("text=Add").click();

    
});



test("PW Test Level Assertion Timeout", async ({ page }) => {

    //set expect timeout for this test to 10 seconds, so that all expect assertions in this test will have a timeout of 10 seconds
    const slowexpect = expect.configure({ timeout: 10000 }); 
    const baseURL = "https://rahulshettyacademy.com/angularpractice/";
   
    await page.goto(baseURL);

    //5second default for expect timeout, can be overridden by passing timeout in options using test level timeouts
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();

    //slowexpect will have a timeout of 10 seconds
    await slowexpect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();
  
});

test("PW Test Level Timeout", async ({ page }) => {

    test.setTimeout(45000)
    const baseURL = "https://rahulshettyacademy.com/angularpractice/";
    //set default timeout for this test to 20 seconds, so that all actions in this test will have a timeout of 20 seconds
    page.setDefaultTimeout(20000); 
    
   
    await page.goto(baseURL);
    //5second default for expect timeout, can be overridden by passing timeout in options using test level timeouts
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();
    await page.pause();
});


/*
TIMEOUTS

Action timeout:
→ Maximum time Playwright waits for an action like click(), fill(), etc.
→ If the element/action is not ready within the timeout, the test fails with a timeout error.

Timeout levels / priority:
→ Global timeout      → Applies to the whole test suite/configuration.
→ Test-level timeout  → Applies to one complete test and overrides the global test timeout.
→ Action-level timeout → Applies only to that specific action and overrides the higher-level action timeout.

Examples:

// Global (playwright.config.js)
timeout: 30000

// Test-level
test.setTimeout(60000);

// Action-level
await page.locator("#login").click({ timeout: 10000 });

Higher-specificity settings override broader settings:
Action-level → Test-level → Global-level
*/

