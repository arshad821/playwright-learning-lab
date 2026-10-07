import {Page, Locator} from "@playwright/test"
export class CheckoutPage {
  //Note: using this so vs will list pw methods
  /**
   * @param {import('@playwright/test').Page} page
   */


   page: Page;
   checkoutButton : Locator


  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.
  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator("button:has-text('Checkout')");
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  getProduct(productName: string) {
    return this.page.getByText(productName);
  }

}
