import {Page, Locator, expect} from "@playwright/test"

export class OrderListPage {
  //Note: using this so vs will list pw methods
  /**
   * @param {import('@playwright/test').Page} page
   */

  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.

  page : Page;
  listoforders : Locator;
  orderDetailsOrderId : Locator;


  constructor(page : Page) {
    this.page = page;
    this.listoforders = page.locator("tbody tr");
    this.orderDetailsOrderId = page.locator(".col-text");
  }

  async VerifyOrderid(OrderID : any) {
    await this.listoforders
           .filter({hasText : OrderID})
           .getByRole("button", { name: "View" })
           .click();

    await expect(this.orderDetailsOrderId).toHaveText(OrderID);  
  }
}


