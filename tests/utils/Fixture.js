/*
Fixture means reusable code for setup and tear down of tests. It is used to create a consistent test environment for multiple tests. 
In Playwright, fixtures can be used to set up the browser, page, and other resources needed for testing. and can be used with matching parameter name in tests
*/
const {test:base , expect} = require("@playwright/test");
const {request} = require("@playwright/test");
const APIutils = require("./APIutils");
const loginPayload = {userEmail: "arsharahsd977@gmail.com", userPassword: "Arshad@7"}
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3"}]}



 exports.customTestbase = base.extend({
/*authenticatedPage
→ Custom fixture that creates a logged-in page for the test. */
    authenticatedPage : async({page}, use) =>
    {
    const baseURL = "https://rahulshettyacademy.com/client/#/auth/login";
    const userNamelocator = page.getByPlaceholder("email@example.com");
    const passwordlocator = page.getByPlaceholder("enter your passsword");
    const username = "arsharahsd977@gmail.com";
    const password = "Arshad@7";
    const loginButton = page.getByRole("button", { name: "Login" });
    const toastpopupmsg = page.locator("#toast-container");

    await page.goto(baseURL);
        await userNamelocator.fill(username);
        await passwordlocator.fill(password);
        await loginButton.click();
       
        //validating logged in by asserting login msg
        await expect(toastpopupmsg).toContainText("Login Successfully");
        await use(page);
        //use is like whatever written will happen first in test and at end whatever writter after use will run like afterAll() teardown
        await page.close()
    },

    CreateOrder : async({}, use) => {
        const apiContext = await request.newContext();
        const apiutils = new APIutils(apiContext, loginPayload);
        let response = await apiutils.createOrder(orderPayload);
        await use(response);
        //tear down
        await apiContext.dispose()
    },
    //data also can be defined in fixture with JSON Object with Fixture Name
    TestDataForOrder : {
        ProductName : "Arshad Test"
    }
})


/*
use(page)
→ Gives the prepared page to the test.
→ Everything before use() = setup
→ Everything after use() = teardown (if we add any)
*/