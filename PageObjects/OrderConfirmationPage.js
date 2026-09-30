class OrderConfirmationPage {
  //Note: using this so vs will list pw methods
  /**
   * @param {import('@playwright/test').Page} page
   */

  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.
  constructor(page) {
    this.page = page;
    this.orderConfirmationMsg = page.locator(".hero-primary");
    this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    this.myorderButton = page.locator("[routerlink*='myorders']");
  }

  async verifyOrderIDandClickMyOrder() {
    const orderIdtext = await this.orderId.textContent();
    const OrderID = orderIdtext.replace(/\|/g, "").trim();
    console.log("Order ID is: " + OrderID);
    await this.myorderButton.first().click();

    return OrderID;
  }
}

module.exports = { OrderConfirmationPage };
