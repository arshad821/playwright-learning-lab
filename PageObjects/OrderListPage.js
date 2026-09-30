const { expect } = require("@playwright/test");

class OrderListPage {
  //Note: using this so vs will list pw methods
  /**
   * @param {import('@playwright/test').Page} page
   */

  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.
  constructor(page) {
    this.page = page;
    this.listoforders = page.locator("tbody tr");
    this.orderDetailsOrderId = page.locator(".col-text");
  }

  async VerifyOrderid(OrderID) {
    await this.listoforders
           .filter({hasText : OrderID})
           .getByRole("button", { name: "View" })
           .click();

    await expect(this.orderDetailsOrderId).toHaveText(OrderID);  
  }
}

module.exports = { OrderListPage };
