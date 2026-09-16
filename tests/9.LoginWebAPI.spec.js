
const { test ,expect,request} = require("@playwright/test");
const loginPayload = {userEmail: "arsharahsd977@gmail.com", userPassword: "Arshad@7"}
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3"}]}
const APIutils = require("./utils/APIutils");
let response;

test.beforeAll(async () => {
   const apiContext = await request.newContext();
   const apiutils = new APIutils(apiContext, loginPayload);
   //store the response object returned from createOrder() in a variable to use it in the test file.
   response = await apiutils.createOrder(orderPayload);

});

test("Web API Login test and Place order through Bypassing Login", async ({ page }) => {

    //Use this to inject an API token into browser storage and bypass UI login. //refer below notes for more details.
    await page.addInitScript(value=>{
        window.localStorage.setItem("token", value)
    }, response.token) //

    const productTitles = page.locator(".card-body");
    const productName = "ZARA COAT 3";
    const addToCartButton = page.getByRole("button", { name: "Add To Cart" });
    const cartButton = page.locator("[routerlink*='cart']");
    const toastpopupmsg = page.locator("#toast-container");

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

    const orderSummaryOrderId = page.locator(".col-text.-main");
    const orderSummaryAddress = page.locator(".address .text")

    await page.goto("https://rahulshettyacademy.com/client/")

    await myorderButton.first().click();

        await listoforders
           .filter({hasText : response.OrderID})
           .getByRole("button", { name: "View" })
           .click();

    await expect(orderDetailsOrderId).toHaveText(response.OrderID);   
                                  
    const billingCountrty = await orderSummaryAddress.filter({hasText: "Country"}).first().textContent();
    expect(billingCountrty).toContain(orderPayload.orders[0].country);
    await expect(orderSummaryOrderId).toHaveText(response.OrderID);

 
   

});
/*
1.Instead of:
Browser → UI → Click → Form → API

We can directly test:
Test → API Request → API Response → Validate Response

2. Import API Request
```js
const { test, expect, request } = require("@playwright/test");

3.
response.ok()
→ Returns true when the response status is successful.

response.status()
→ Returns HTTP status code.

response.json()
→ Returns response body as JSON.

response.text()
→ Returns response body as text.

response.headers()
→ Returns response headers.

*/

/*
addInitScript()
→ Runs JavaScript before the page loads.

localStorage.setItem("key", value)
→ Stores the value in browser localStorage.

addInitScript(..., token)
→ Passes the Playwright/Node.js token into the browser-side script.


*/

/*
localStorage vs sessionStorage

→ Both store data in the browser.

localStorage
→ Data persists even after closing the browser.

sessionStorage
→ Data normally lasts for the current browser tab/session.

IMPORTANT:
→ Use the storage type and key expected by the application.
*/

/*
beforeAll()
→ Runs once before all tests.

beforeEach()
→ Runs before every test.
*/

/*
WHY THIS DESIGN?

APIutils → handles API operations
response → brings API results back to the test
test → uses token + OrderID for UI validation

Constructor:
→ apiContext + loginPayload are common/reusable → store with this.

createOrder(orderPayload):
→ orderPayload is specific to this method → pass directly.

return response:
→ sends token + OrderID back to the test.
*/