
const { test ,expect,request} = require("@playwright/test");
const loginPayload = {userEmail: "arsharahsd977@gmail.com", userPassword: "Arshad@7"}
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3"}]}
const fakePayload = {"data":[],"message":"No Orders"}
const APIutils = require("./utils/APIutils");
let response;

test.beforeAll(async () => {
   const apiContext = await request.newContext();
   const apiutils = new APIutils(apiContext, loginPayload);
   //store the response object returned from createOrder() in a variable to use it in the test file.
   response = await apiutils.createOrder(orderPayload);

});

test("Web API Login test and Intercept Response Payload order API", async ({ page }) => {

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

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", 
       async route =>
        {
            //page.request -switches the context to request from the browser to the playwright, so we can fetch the response from the server and modify it before sending it to the browser.
            //fetch(route.request()) - fetches the response from the server for the request that was intercepted by playwright.
            const response = await page.request.fetch(route.request());
           //to convert js obj payload to json string
            const body = JSON.stringify(fakePayload);        
             //fulfill(route) - sends the modified response to the browser.  
            route.fulfill(
                {
                    response,
                    body,
            }
            )
           
        }

    )
    //api call should hapen before clicking the myorder button
    await myorderButton.first().click();
    //waiting for the request to complete ifnot it will throw network disposed error because the request is intercepted and the response is not sent to the browser until we fulfill it.
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
    await expect(page.getByText("You have No Orders to show at this time.")).toBeVisible();
    //await page.pause()

});



//intercepting response - 1. fetching the response from the server, 2. playwright (modifying the response), 3. sending the modified response to the browser.

/*(https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6a7c3bc485b8849b4943e012 
end with star * so that any with any userid script will work normally - https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*)


page.route()
→ To Intercepts a network request made by the browser.


route.fulfill()
→ Sends the response back to the browser.
→ We can use it to return the real response or a modified/fake response.
*/