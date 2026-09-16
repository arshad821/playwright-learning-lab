const { test ,expect} = require("@playwright/test");
let webContext;

test.beforeAll(async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const baseURL = "https://rahulshettyacademy.com/client/#/auth/login";
    const userNamelocator = page.locator("input#userEmail");
    const passwordlocator = page.locator("input#userPassword");
    const username = "arsharahsd977@gmail.com";
    const password = "Arshad@7";
    const loginButton = page.locator("#login");
     const toastpopupmsg = page.locator("#toast-container");

     await page.goto(baseURL);
    await userNamelocator.fill(username);
    await passwordlocator.fill(password);
    await loginButton.click();
   
    await expect(toastpopupmsg).toContainText("Login Successfully");
    
    await context.storageState({path: "state.json"}); //save the storage state to a file named state.json
    //Create a new browser context already having that state.
    webContext= await browser.newContext({storageState: "state.json"}); //use the storage state from the file to create a new context
  });  

test("E2E Order Placement - Locators, Filters, Assertions & Dynamic Data", async () => {
    //Use the webContext to create a new page and navigate to the application
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/");

    const toastpopupmsg = page.locator("#toast-container");
    const productTitles = page.locator(".card-body");
    const productName = "ZARA COAT 3";
    const addToCartButton = page.locator("text=Add To Cart");
    const cartButton = page.locator("[routerlink*='cart']");

    const productlistinCart = page.locator(".cart li");
    const checkoutButton = page.locator("button:has-text('Checkout')");

    const countryDropdownInput = page.locator("[placeholder*='Country']");
    const countryOptions = page.locator(".ta-results");
    const usernameLabels = page.locator(".user__name [type='text']");
    const placeOrderButton = page.locator("text=Place Order");

    const orderConfirmationMsg = page.locator(".hero-primary");
    const orderId = page.locator(".em-spacer-1 .ng-star-inserted");

    const myorderButton = page.locator("[routerlink*='myorders']");
    const listoforders = page.locator("tbody tr");

    const orderDetailsOrderId = page.locator(".col-text");

    await productTitles.first().waitFor(); 

    const selectedproduct = productTitles.filter({ hasText: productName });

    await selectedproduct.locator(addToCartButton).click();
    
    await expect(toastpopupmsg).toContainText("Product Added To Cart");

   

    await cartButton.click();
    await expect(page.locator("h3:has-text('ZARA COAT 3')")).toBeVisible();

    await checkoutButton.click();

    
    await countryDropdownInput.pressSequentially("ind", { delay: 100 }); 
    await countryOptions.filter({ hasText: "India" }).click();


    await placeOrderButton.click();

    await expect(orderConfirmationMsg).toHaveText(" Thankyou for the order. ");

    const orderIdtext = await orderId.textContent();
    const OrderID = orderIdtext.replace(/\|/g, "").trim();
    console.log("Order ID is: " + OrderID);
    await myorderButton.first().click();

   
    await listoforders
           .filter({hasText : OrderID})
           .getByRole("button", { name: "View" })
           .click();

    await expect(orderDetailsOrderId).toHaveText(OrderID);       
});


/*what is storagestate in playwright?
    Storage state is a JSON file that contains all the cookies and local storage data for a particular browser context. 
    It allows you to save the state of a browser session and reuse it later, which can be useful for testing scenarios that require authentication or other session-specific data.



WHY USE IT?
→ Login once → save the state → reuse it in other tests.
→ Avoid repeating UI login for every test.
→ Makes tests faster and keeps the test focused on the actual scenario.

WHEN TO USE?
→ When many tests require the same logged-in user/session.
→ Especially useful for E2E tests where login is not the thing
  you actually want to test.
    */


/*
addInitScript()
→ Manually inject a specific value (e.g., API token)
   into localStorage before the page loads.

storageState (some banking app doesn't expose the token in that case)
→ Save the complete authentication/session state and reuse it
   when creating a new browser context.

Remember:
addInitScript = "I have the token → inject it."

storageState = "I logged in but difficualt/unable to fetch token → save/reuse the session."
*/