const { Given, When, Then } = require("@cucumber/cucumber");
const { PO_Manager } = require("../../PageObjects/PO_Manager");

const { expect } = require("@playwright/test");

//Error: function timed out, ensure the promise resolves within 5000 milliseconds
// each cucumber step max can handle 5 sec by default,so manually sertting the timeout little extra
Given(
  "User should login to the ecommerce site with {string} and {string}", {timeout: 10 * 1000},
  async function (username, password) {
    
    const loginpage = this.pomanager.getloginpage();
    await loginpage.goTo();
    await loginpage.ValidLogin(username, password);
    
    await expect(loginpage.toastpopupmsg).toContainText("Login Successfully");
  },
);

When("User adds {string} to the cart", async function (productName) {
  this.dashboardpage = this.pomanager.getdashboardpage();
  await this.dashboardpage.SearchProductAndAddCart(productName);
  await expect(this.dashboardpage.toastpopupmsg).toContainText(
    "Product Added To Cart",
  );
});

Then(
  "User should be able to see the {string} product in the cart",
  async function (productName) {
    const checkoutPage = this.pomanager.getcheckoutpage();
    await this.dashboardpage.navigateTocart();
    await checkoutPage.clickCheckout();
    await expect(checkoutPage.getProduct(productName)).toBeVisible();
  },
);

When(
  "user enter valid country code {string} and country name {string} and verify {string} and place order",
  async function (CountryCode, CountryName, username) {
    const fillorderinfoPage = this.pomanager.getfillorderinfopage();
    await fillorderinfoPage.searchCountryAndSelect(CountryCode, CountryName);
    await fillorderinfoPage.VerifyUsernameandclickPlaceOrder(username);
    this.orderconfirmpage = this.pomanager.getorderConfirmpage();
    await expect(this.orderconfirmpage.orderConfirmationMsg).toHaveText(
      " Thankyou for the order. ",
    );
  },
);

Then("User should verify the order in order history page", async function () {
  const orderlistingpage = this.pomanager.getOrderlistingpage();
  const OrderID = await this.orderconfirmpage.verifyOrderIDandClickMyOrder();
  await orderlistingpage.VerifyOrderid(OrderID);
});


/*
CUCUMBER WORLD — `this`
-----------------------------------------------------------

If an object/value needs to be reused by another step,
store it on Cucumber's World using `this`.

Example:

Given("I login", async function () {
    this.pomanager = new PO_Manager(page);
});

Another step:

When("I add product", async function () {
    const dashboardPage = this.pomanager.getdashboardpage();
});

Why?

Without `this`:
→ Variable is local to that step.

With `this`:
→ Object is stored in the current Scenario's World.
→ Other steps in the same Scenario can access it.

IMPORTANT:
Use normal `function`, not arrow function:

async function () { }     ✅
async () => { }           ❌ for Cucumber World `this`

Mental model:

Step 1
   ↓
this.pomanager = ...
   ↓
Cucumber World
   ↓
Step 2
   ↓
this.pomanager

World is created separately for each Scenario.
*/