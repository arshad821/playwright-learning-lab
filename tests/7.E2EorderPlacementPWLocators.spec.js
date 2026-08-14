/*
This code can be ignored it's just a handson
*/
const { test ,expect} = require("@playwright/test");

test("E2E Order Placement - Locators, Filters, Assertions & Dynamic Data", async ({ page }) => {

    const baseURL = "https://rahulshettyacademy.com/client/#/auth/login";
    const userNamelocator = page.getByPlaceholder("email@example.com");
    const passwordlocator = page.getByPlaceholder("enter your passsword");
    const username = "arsharahsd977@gmail.com";
    const password = "Arshad@7";
    const loginButton = page.getByRole("button", { name: "Login" });

    const toastpopupmsg = page.locator("#toast-container");
    const productTitles = page.locator(".card-body");
    const productName = "ZARA COAT 3";
    const addToCartButton = page.getByRole("button", { name: "Add To Cart" });
    const cartButton = page.locator("[routerlink*='cart']");

    const productlistinCart = page.locator(".cart li");
    const checkoutButton = page.getByRole("button", { name: "Checkout" });

    const countryDropdownInput = page.getByPlaceholder("Select Country");
    const countryOptions = page.locator(".ta-results");
    const usernameLabels = page.locator(".user__name [type='text']");
    const placeOrderButton = page.getByText("Place Order");

    const orderConfirmationMsg = page.getByText("Thankyou for the order.");
    const orderId = page.locator(".em-spacer-1 .ng-star-inserted");

    const myorderButton = page.locator("[routerlink*='myorders']");
    const listoforders = page.locator("tbody tr");

    const orderDetailsOrderId = page.locator(".col-text");


    await page.goto(baseURL);
    await userNamelocator.fill(username);
    await passwordlocator.fill(password);
    await loginButton.click();
   
    //validating logged in by asserting login msg
    await expect(toastpopupmsg).toContainText("Login Successfully");

    // Wait until at least one product card is available
    await productTitles.first().waitFor(); 

    // Filter the product cards and select the card containing the required product name dynamically
    const selectedproduct = productTitles.filter({ hasText: productName });
    // Locate the Add To Cart button inside the selected product and click it
    await selectedproduct.locator(addToCartButton).click();//click()  → performs an action → await
    
    //validating product added to cart, as there's some slight delay better validate sucess msg and click cart
    await expect(toastpopupmsg).toContainText("Product Added To Cart");

   // Alternative approach: manually iterate through all products and find the matching product.
   // Kept here for learning/reference; Playwright's filter() approach above is cleaner and preferred.
   /*
   const prodCount = await productTitles.count();

   for (let i = 0; i < prodCount; i++) {
    if (await productTitles.nth(i).locator("b").textContent() === productName) {
        await productTitles.nth(i).locator(addToCartButton).click();
        break;
    }
    }  
    */

    await cartButton.click();
    // isVisible() checks the current visibility immediately and does not auto-wait/retry.
    // toBeVisible() is a web-first assertion that automatically waits/retries until the element is visible.
    await expect(page.locator("h3:has-text('ZARA COAT 3')")).toBeVisible();

    await checkoutButton.click();

    // Type character-by-character to trigger the country auto-suggestion dropdown
    await countryDropdownInput.pressSequentially("ind", { delay: 100 }); //simulate typing with a delay of 100ms to trigger autosuggestion
    // Filter the suggestions and select India
    await countryOptions.filter({ hasText: "India" }).click();

    // Normal element text → toHaveText() / toContainText()
    await expect(usernameLabels.first()).toHaveText(username);
    // Input field Validation → toHaveValue()
    await expect(usernameLabels.last()).toHaveValue(username);
    await placeOrderButton.click();

    await expect(orderConfirmationMsg).toBeVisible();

    const orderIdtext = await orderId.textContent();
    const OrderID = orderIdtext.replace(/\|/g, "").trim();
    console.log("Order ID is: " + OrderID);
    await myorderButton.first().click();

    // Filter the list of orders to find the row containing the specific Order ID and click the corresponding "View" button
    //using getByRole() to locate the button within the filtered row with name "View" and click it
    await listoforders
           .filter({hasText : OrderID})
           .getByRole("button", { name: "View" })
           .click();

    await expect(orderDetailsOrderId).toHaveText(OrderID);       
});


// await → Use for actions, waits, retrieving values, and assertions.
// No await → Use when only creating or narrowing a locator, e.g. locator(), filter(), first(), nth().

/*
Points to Note:
type is deprecated
In most cases, you should use locator.fill(value[, options]) instead. 
to press keys one by one if there is special keyboard handling on the page - in this case use locator.pressSequentially(text[, options]).
*/