
const { test ,expect} = require("@playwright/test");

test("Capture Screenshot FullScreen & Element Level", async ({ page }) => {

    const baseURL = "https://rahulshettyacademy.com/client/#/auth/login";
    const userNamelocator = page.locator("input#userEmail");
    const passwordlocator = page.locator("input#userPassword");
    const username = "arsharahsd977@gmail.com";
    const password = "Arshad@7";
    const loginButton = page.locator("#login");
    const productName = "ZARA COAT 3";
    const productTitles = page.locator(".card-body");
    const toastpopupmsg = page.locator("#toast-container");



    await page.goto(baseURL);
    await userNamelocator.fill(username);
    await passwordlocator.fill(password);
    await loginButton.click();
   
 
    await expect(toastpopupmsg).toContainText("Login Successfully");
    await productTitles.first().waitFor(); 
    //to take full screen shot
    await page.screenshot({path: "fullscreenshot.png"})
    const selectedproduct = productTitles.filter({ hasText: productName });
     // to take element level screenshot
    await selectedproduct.screenshot({path:"elementlevelscreenshot.png"})

});

//Purpose - like how human compare, pw compares each and every pixel like human
test("Visual Testing by Comparing Screenshots-Amazon", async ({ page }) => {

    const ordersbutton = page.locator("#nav-orders");

    await page.goto("https://www.amazon.ae/")
    await page.waitForSelector("#nav-orders")
    //on firt run if there's no screenshot it will run and fail and capture the actual and store
    //on second run it does the comparison
    expect (await page.screenshot()).toMatchSnapshot('AmazonLanding.png')
    //the layouts are dynamic obviously it's gonna fail
});


test("Visual Testing by Comparing Screenshots-Google", async ({ page }) => {

    const ordersbutton = page.locator("#nav-orders");

    await page.goto("https://www.google.ae/")
    //on firt run if there's no screenshot it will run and fail and capture the actual and store
    //on second run it does the comparison
    expect (await page.screenshot()).toMatchSnapshot('GoogleLanding.png')

});