const { expect } = require("@playwright/test");

class FillOrderInfoPage {
  //Note: using this so vs will list pw methods
  /**
   * @param {import('@playwright/test').Page} page
   */

  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.
  constructor(page) {
    this.page = page;
    this.countryDropdownInput = page.locator("[placeholder*='Country']");
    this.countryOptions = page.locator(".ta-results");
    this.usernameLabels = page.locator(".user__name [type='text']");
    this.placeOrderButton = page.locator("text=Place Order");
  }

  async searchCountryAndSelect(countrycode,countryName) {
    await this.countryDropdownInput.pressSequentially(countrycode, { delay: 100 });
    await this.countryOptions.filter({ hasText: countryName }).click();

  }

  async VerifyUsernameandclickPlaceOrder(username){
    await expect(this.usernameLabels.first()).toHaveText(username);
    await expect(this.usernameLabels.last()).toHaveValue(username);
    await this.placeOrderButton.click();
  }

  
}

module.exports = { FillOrderInfoPage };
