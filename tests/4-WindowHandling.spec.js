const { test ,expect} = require("@playwright/test");

test.only("Window Handling Test", async ({ browser }) => {


    const context = await browser.newContext();
    const page = await context.newPage();

    const baseURL = "https://rahulshettyacademy.com/loginpagePractise/";
    const userName = page.locator("input#username");
    const password = page.locator("[type='password']");
    const signInButton = page.locator("#signInBtn");
    const blinklinktext = page.locator("[href*='document']")

    await page.goto(baseURL);

    // The newly opened tab/page is stored in 'newpage'
    const [newpage] = await Promise.all([
    context.waitForEvent('page'),
    blinklinktext.click() ]);

    const redMessage  = newpage.locator(".red");
    const redText = await redMessage .textContent();
    console.log(redText);

    // Split the text at "@" and extract the email domain
   const emailParts =  redText.split("@");
   // From the domain part, extract only the email domain before the next space
   const domain = emailParts[1].split(" ")[0]

    console.log(domain);
    await userName.type(domain);
    await password.type("Learning@830$3mK2");
    await signInButton.click();

    
});


/*
Promise.all()

Used when an action triggers another event (new tab, popup, download, etc.).

Example:
- Start waiting for the event.
- Perform the action.
- Continue once both are completed.

This helps avoid missing events that may occur immediately after the action.
*/

/*
textContent()
→ Gets the text inside an element.

inputValue()
→ Gets the current value entered in an input field.
*/