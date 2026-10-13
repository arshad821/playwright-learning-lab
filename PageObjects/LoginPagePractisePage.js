class LoginPagePractisePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.termsCheckbox = page.locator('#terms');
        this.signInButton = page.locator('#signInBtn');
        this.productCards = page.locator('h4.card-title');
    }

    async goTo() {
        await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.termsCheckbox.check();
        await this.signInButton.click();
    }

    async waitForShopPage() {
        await this.page.waitForURL('**/angularpractice/shop', { timeout: 20000 });
    }

    async productCard(productName) {
        return this.productCards.filter({ hasText: new RegExp(productName, 'i') });
    }
}

module.exports = { LoginPagePractisePage };
