import {Page, Locator} from "@playwright/test"


export class LoginPage {

    //Note: using this so vs will list pw methods
   /**
   * @param {import('@playwright/test').Page} page
   */

  // WHY: Receive the actual Playwright page from the test
  // so this POM can create and use locators on that page.

    page:Page;
    userName: Locator;
    PassWord: Locator;
    LoginButton: Locator;
    toastpopupmsg: Locator;

  constructor(page: Page) {
    this.page = page
    this.userName = page.locator("input#userEmail");
    this.PassWord = page.locator("input#userPassword");
    this.LoginButton = page.locator("#login");
    this.toastpopupmsg = page.locator("#toast-container");
  }

  async goTo(){
    const baseURL = "https://rahulshettyacademy.com/client/#/auth/login";
    this.page.goto(baseURL);
  }

  //un, pw passed as param from test file
  async ValidLogin(username : string, password: string) {
    await this.userName.fill(username);
    await this.PassWord.fill(password);
    await this.LoginButton.click();
  }
}


