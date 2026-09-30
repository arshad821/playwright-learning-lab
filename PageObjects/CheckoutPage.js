const { expect } = require("@playwright/test");

class CheckoutPage {
  //Note: using this so vs will list pw methods
  /**
   * @param {import('@playwright/test').Page} page
   */

  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator("button:has-text('Checkout')");
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  getProduct(productName) {
    return this.page.getByText(productName);
  }

}

module.exports = { CheckoutPage };
