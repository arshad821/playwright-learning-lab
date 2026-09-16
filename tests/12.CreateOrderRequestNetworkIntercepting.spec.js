const { test, expect, request } = require("@playwright/test");




test("Security Testing by intercepting API requests", async ({
    page,
}) => {

     const baseURL = "https://rahulshettyacademy.com/client/#/auth/login";
    const userNamelocator = page.getByPlaceholder("email@example.com");
    const passwordlocator = page.getByPlaceholder("enter your passsword");
    const username = "arsharahsd977@gmail.com";
    const password = "Arshad@7";
    const loginButton = page.getByRole("button", { name: "Login" });
    const myorderButton = page.locator("[routerlink*='myorders']");
    const toastpopupmsg = page.locator("#toast-container");
    const viewbutton = page.getByRole("button", { name: "View" });
    const erormessage = page.locator(".blink_me");

    await page.goto("https://rahulshettyacademy.com/client/");

    await page.goto(baseURL);
    await userNamelocator.fill(username);
    await passwordlocator.fill(password);
    await loginButton.click();
   
    //validating logged in by asserting login msg
    await expect(toastpopupmsg).toContainText("Login Successfully");
    await myorderButton.click();
    //route() method is used to intercept network requests made by the page. 
    // In this case, we are intercepting the request to get order details and modifying the response to simulate a scenario where the user has no orders. 
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
       //continue() method is used to continue the intercepted request with a modified url,body, or headers. In this case, we are modifying the url to simulate a scenario where the user has no orders.
        route => route.continue({
            url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=640f3e7b0c1a2e0015d8f9a4"
        })
    )
    //before trying to click view button, we will intercept the request and modify the response to simulate a scenario where the order not belongs to the logged-in user. 
    // This is a security testing technique to check how the application handles unexpected or manipulated responses.
    await viewbutton.first().click();
    await expect(erormessage).toContainText("You are not authorize to view this order");
    //await page.pause()
});

