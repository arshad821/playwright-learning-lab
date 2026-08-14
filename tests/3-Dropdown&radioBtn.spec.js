const { test ,expect} = require("@playwright/test");

test.only("Dropdown, Radio Button & Checkbox Test", async ({ page }) => {


    const baseURL = "https://rahulshettyacademy.com/loginpagePractise/";
    const userName = page.locator("input#username");
    const password = page.locator("[type='password']");
    const signInButton = page.locator("#signInBtn");
    const errorMessage = page.locator("[style*='block']");
    const radiobtn = page.locator(".checkmark"); //traversing from parent to child using css locator
    const okaybtn = page.locator("#okayBtn");
    const dropdown = page.locator("select.form-control");
    const blinklinktext = page.locator("[href*='document']")
    const termsCheckbox = page.locator("#terms");

    await page.goto(baseURL);

    await userName.type("rahulshettyacademy");
    await password.type("Learning@830$3mK2");

    await dropdown.selectOption("consult"); 

    await radiobtn.last().click(); //click on the 2nd radio button
    await expect(radiobtn.last()).toBeChecked(); 
    await okaybtn.click(); //click on the okay button to close the alert

    await termsCheckbox.check(); 
    await expect(termsCheckbox).toBeChecked(); 

    await termsCheckbox.uncheck(); 
    await expect(termsCheckbox).not.toBeChecked(); //assert that the terms checkbox is not checked

    //assert that the blinking link has the expected class attribute
    await expect(blinklinktext).toHaveAttribute("class", "blinkingText"); 

    //await page.pause(); //pause the execution to inspect the page and verify the radio button selection
    await signInButton.click();

    
});

/*
DROPDOWN
selectOption() selects an option from a <select> dropdown.

Supports:
- value → selectOption("consult")
- label → selectOption({ label: "Consultant" })
- index → selectOption({ index: 2 })

RADIO BUTTON
Radio buttons are selected using click().


CHECKBOX

check()
→ Ensures the checkbox is checked. (Preferred)

uncheck()
→ Ensures the checkbox is unchecked. (Preferred)

click()
→ Toggles the checkbox state.

toBeChecked()
→ Verifies whether a checkbox or radio button is selected.
*/