const { test, expect } = require('@playwright/test');
const { LoginPagePractisePage } = require('../PageObjects/LoginPagePractisePage');

test('Login page practise - valid login and product verification', async ({ page }) => {
    const loginPage = new LoginPagePractisePage(page);

    await loginPage.goTo();

    // The live site rejects the legacy 'learning' password and shows the current valid value.
    await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2');
    await loginPage.waitForShopPage();

    await expect(page).toHaveURL('https://rahulshettyacademy.com/angularpractice/shop');
    await expect(await loginPage.productCard('iphone X')).toBeVisible();
});
