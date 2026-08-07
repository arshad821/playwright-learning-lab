
const { test ,expect} = require("@playwright/test");

test.only("PW Locator and Fill Test", async ({ page }) => {


    const baseURL = "https://rahulshettyacademy.com/loginpagePractise/";
    const userName = page.locator("input#username");
    const password = page.locator("[type='password']");
    const signInButton = page.locator("#signInBtn");
    const errorMessage = page.locator("[style*='block']");
    const producttitles = page.locator(".card-body a"); //traversing from parent to child using css locator

    await page.goto(baseURL);

    // Validate that the page title matches the expected title
    // toHaveTitle() is a Playwright assertion and automatically waits/retries
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //stored as a variable to avoid retyping the locator multiple times
    await userName.type("rahulshetty");
    await password.type("Learning@830$3mK2");
    await signInButton.click();

    // textContent() returns the text available inside the matched element
    console.log(await errorMessage.textContent());
    // toContainText() automatically waits/retries until the expected text appears
    await expect(errorMessage).toContainText("Incorrect");
    //fill automatically clears the input field before filling it with the provided value. 
    await userName.fill("rahulshettyacademy");
    await signInButton.click();

    // Wait until there are no ongoing network requests before continuing 
    // so alltextContents() will return the text contents of all the matching elements and not an empty array
    /*await page.waitForLoadState('networkidle'); */ //advanced wait for network idle state to ensure all network requests are completed before proceeding

    //mostofthetimes networkidle is flaky in that case we can use waitFor() on the locator to wait for the element
    await producttitles.first().waitFor(); //wait for the specific product title to be available before retrieving their text contents

    //allTextContents() returns an array of all the text contents of the matched elements
    //it will return empty array if no elements are found so it won't wait/retry like the other locators
    console.log(await producttitles.allTextContents()); 
    // first() selects the first matching elemen
    console.log(await producttitles.first().textContent());  
    // nth(index) selects a specific matching element using zero-based index
    // nth(1) → second matching element (0 = first, 1 = second, 2 = third...)
    console.log(await producttitles.nth(1).textContent());
});


/*
difference between fill and type
- fill() → clears the input field and fills it with the provided value. It does not simulate typing.(preferred for most cases)
- type() → simulates typing into the input field, character by character, which can be useful for testing scenarios where typing speed or key events matter.
*/


/*
In Playwright, we can locate elements using CSS selectors or Xpath. CSS selectors are generally preferred for their simplicity and performance. Below are some quick notes on using CSS locators effectively:
CSS LOCATOR QUICK NOTES

1. If ID is present:
   tagname#id
   OR
   #id

2. If class attribute is present:
   tagname.className
   OR
   .className

3. Using any attribute:
   [attribute='value']

4. Traverse from parent to child:
   parentTagname > childTagname

5. Locate based on visible text:
   text='Your Text'

6. Locate based on partial text:
    [attribute*='value']  → * means contains
    [attribute^='value']  → ^ means starts with
    [attribute$='value']  → $ means ends with

7. write css with traversing from parent to child 
     parentTagname > childTagname[attribute='value'] > grandChildTagname

8. write css based on text
     text='Your Text'  → exact match
     text*='Your Text' → partial match
*/

