import {Page, Locator} from "@playwright/test"
export class DashboardPage {

    //Note: using this so vs will list pw methods
   /**
   * @param {import('@playwright/test').Page} page
   */

  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.


    page: Page;
    ProductTitles : Locator;
    addToCartButton : Locator;
    cartButton : Locator;
    toastpopupmsg : Locator


  constructor(page : Page) {
    this.page = page
    this.ProductTitles = page.locator(".card-body");
    this.addToCartButton = page.locator("text=Add To Cart");
    this.cartButton = page.locator("[routerlink*='cart']");
    this.toastpopupmsg = page.locator("#toast-container");
  }

  async goTo(){
    const baseURL = "https://rahulshettyacademy.com/client/#/auth/login";
    this.page.goto(baseURL);
  }

  
  async SearchProductAndAddCart(productName : string){
    await this.ProductTitles.first().waitFor(); 
    const selectedproduct = this.ProductTitles.filter({ hasText: productName });
    await selectedproduct.locator(this.addToCartButton).click();
  }

  async navigateTocart(){
    await this.cartButton.click();
  }
}

