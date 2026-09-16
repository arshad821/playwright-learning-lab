const { test, expect, request } = require("@playwright/test");




test("Network Intercepting Abort Backend Calls and API calls Listeners", async ({
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
    //abort all backend calls to simulate a scenario where the backend is down or not responding.
    //await page.route("**/*.{jpg,jpeg,png}", route => route.abort());  //abort all image requests
    
    //event listener to listen to all network requests made by the page and log them to the console.
    await page.on("request", request => console.log(request.url()));
    //event listener to listen to all network responses received by the page and log them to the console.
    await page.on("response", response => console.log(response.url(), response.status()));
    await page.pause();
});

