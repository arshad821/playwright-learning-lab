import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://rahulshettyacademy.com/client';
const EMAIL = process.env.APP_EMAIL || 'arsharahsd977@gmail.com';
const PASSWORD = process.env.APP_PASSWORD || 'Arshad@7';
const PRODUCT = 'iphone 13 pro';

// ---------- helpers ----------
async function login(page:Page) {
  await page.goto(`${BASE_URL}/#/auth/login`);
  await page.locator('#userEmail').fill(EMAIL);
  await page.locator('#userPassword').fill(PASSWORD);
  await page.locator('#login').click();
  await page.waitForLoadState('networkidle');
}

async function addProductToCart(page: Page, productName: string) {
  const cards = page.locator('.card-body');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).locator('b').textContent();
    if (title?.trim().toLowerCase() === productName.toLowerCase()) {
      await cards.nth(i).locator('button:has-text("Add To Cart")').click();
      break;
    }
  }
}

async function goToCheckout(page: Page) {
  await page.locator('button[routerlink*="cart"]').click();
  await page.locator('div.cart li').first().waitFor();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.locator('.payment__title').first().waitFor();
}

async function selectCountry(page: Page, typed: string, countryName: string) {
  const country = page.locator('input[placeholder="Select Country"]');
  await country.pressSequentially(typed, { delay: 100 });
  const options = page.locator('.ta-results button');
  await options.first().waitFor();
  const total = await options.count();
  for (let i = 0; i < total; i++) {
    const text = (await options.nth(i).textContent())?.trim();
    if (text === countryName) {
      await options.nth(i).click();
      break;
    }
  }
}

// ---------- tests ----------
test.describe('Checkout / Order screen', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.locator('.card-body').first().waitFor();
    await addProductToCart(page, PRODUCT);
    await goToCheckout(page);
  });

  // ===== Page load & product summary =====
  test.describe('Page load and product summary', () => {
    test('shows product details correctly', async ({ page }) => {
      await expect(page.locator('.item__title')).toContainText(PRODUCT);
      await expect(page.locator('.item__price')).toContainText('$');
      await expect(page.locator('.item__quantity')).toContainText('Quantity: 1');
      await expect(page.locator('.item__description li').first()).toBeVisible();
      await expect(page.locator('img.iphone')).toBeVisible();
    });

    test('cart badge shows 1 item', async ({ page }) => {
      await expect(page.locator('button:has-text("Cart") label')).toHaveText('1');
    });

    test('logged-in email is displayed in shipping section', async ({ page }) => {
      await expect(page.locator('.user__name label')).toHaveText(EMAIL);
    });
  });

  // ===== Payment methods =====
  test.describe('Payment methods', () => {
    test('all four payment methods are listed', async ({ page }) => {
      const types = page.locator('.payment__type');
      await expect(types).toHaveCount(4);
      await expect(types).toHaveText([/Credit Card/, /Paypal/, /SEPA/, /Invoice/]);
    });

    test('credit card is selected by default', async ({ page }) => {
      await expect(page.locator('.payment__type--cc')).toHaveClass(/active/);
    });

    test('card number field is prefilled', async ({ page }) => {
      await expect(page.locator('.field:has-text("Credit Card Number") input'))
        .toHaveValue('4542 9931 9292 2293');
    });
  });

  // ===== Card form fields =====
  test.describe('Card details form', () => {
    test('expiry month and year defaults and options', async ({ page }) => {
      const month = page.locator('select.ddl').nth(0);
      const year = page.locator('select.ddl').nth(1);
      await expect(month).toHaveValue('01');
      await expect(year).toHaveValue('16');
      await expect(month.locator('option')).toHaveCount(12);
      await expect(year.locator('option')).toHaveCount(31);
    });

    test('user can change expiry month and year', async ({ page }) => {
      const month = page.locator('select.ddl').nth(0);
      const year = page.locator('select.ddl').nth(1);
      await month.selectOption('08');
      await year.selectOption('25');
      await expect(month).toHaveValue('08');
      await expect(year).toHaveValue('25');
    });

    test('user can enter CVV and name on card', async ({ page }) => {
      const cvv = page.locator('.field:has-text("CVV Code") input');
      const name = page.locator('.field:has-text("Name on Card") input');
      await cvv.fill('123');
      await name.fill('Mohamed Arshad');
      await expect(cvv).toHaveValue('123');
      await expect(name).toHaveValue('Mohamed Arshad');
    });

    test('card number can be edited', async ({ page }) => {
      const card = page.locator('.field:has-text("Credit Card Number") input');
      await card.fill('4111 1111 1111 1111');
      await expect(card).toHaveValue('4111 1111 1111 1111');
    });
  });

  // ===== Coupon =====
  test.describe('Coupon', () => {
    test('valid coupon is applied', async ({ page }) => {
      await page.locator('input[name="coupon"]').fill('rahulshettyacademy');
      await page.getByRole('button', { name: 'Apply Coupon' }).click();
      await expect(page.getByText('* Coupon Applied')).toBeVisible();
    });

    test('invalid coupon shows error', async ({ page }) => {
      await page.locator('input[name="coupon"]').fill('WRONG123');
      await page.getByRole('button', { name: 'Apply Coupon' }).click();
      await expect(page.getByText('* Invalid Coupon')).toBeVisible();
    });

    test('empty coupon does not apply anything', async ({ page }) => {
      await page.getByRole('button', { name: 'Apply Coupon' }).click();
      await expect(page.getByText('* Coupon Applied')).toHaveCount(0);
    });
  });

  // ===== Country autocomplete =====
  test.describe('Country selection', () => {
    test('suggestions appear while typing', async ({ page }) => {
      await page.locator('input[placeholder="Select Country"]').pressSequentially('ind', { delay: 100 });
      const options = page.locator('.ta-results button');
      await expect(options.first()).toBeVisible();
      const texts = await options.allTextContents();
      for (const t of texts) {
        expect(t.toLowerCase()).toContain('ind');
      }
    });

    test('selecting a suggestion fills the field', async ({ page }) => {
      await selectCountry(page, 'ind', 'India');
      await expect(page.locator('input[placeholder="Select Country"]')).toHaveValue(/India/);
    });

    test('no suggestions for invalid country text', async ({ page }) => {
      await page.locator('input[placeholder="Select Country"]').pressSequentially('zzzz', { delay: 100 });
      await expect(page.locator('.ta-results button')).toHaveCount(0);
    });
  });

  // ===== Place order =====
  test.describe('Place order', () => {
    test('happy path - order is placed successfully', async ({ page }) => {
      await page.locator('.field:has-text("CVV Code") input').fill('123');
      await page.locator('.field:has-text("Name on Card") input').fill('Mohamed Arshad');
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();

      await expect(page).toHaveURL(/thanks/);
      await expect(page.locator('.hero-primary')).toHaveText(/Thankyou for the order/i);

      const orderId = (await page.locator('.em-spacer-1 .ng-star-inserted').textContent())!
        .replace(/\|/g, '')
        .trim();
      expect(orderId).not.toBe('');

      // verify the order shows up in My Orders
      await page.locator('button[routerlink*="myorders"]').first().click();
      await page.locator('tbody').waitFor();
      await expect(page.locator('tbody')).toContainText(orderId);
    });

    test('order without selecting country is not placed', async ({ page }) => {
      await page.locator('.field:has-text("CVV Code") input').fill('123');
      await page.locator('.field:has-text("Name on Card") input').fill('Mohamed Arshad');
      await page.locator('.action__submit').click();
      await expect(page).not.toHaveURL(/thanks/);
      await expect(page.locator('.payment__title').first()).toBeVisible();
    });

    // These two depend on how the app validates - raise as defects if they pass the order
    test.fixme('order with empty CVV should be blocked', async ({ page }) => {
      await page.locator('.field:has-text("Name on Card") input').fill('Mohamed Arshad');
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();
      await expect(page).not.toHaveURL(/thanks/);
    });

    test.fixme('order with empty name on card should be blocked', async ({ page }) => {
      await page.locator('.field:has-text("CVV Code") input').fill('123');
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();
      await expect(page).not.toHaveURL(/thanks/);
    });
  });

  // ===== Navigation =====
  test.describe('Navigation', () => {
    test('HOME goes to dashboard', async ({ page }) => {
      await page.getByRole('button', { name: /HOME/ }).click();
      await expect(page).toHaveURL(/dashboard/);
    });

    test('ORDERS goes to my orders', async ({ page }) => {
      await page.getByRole('button', { name: /ORDERS/ }).click();
      await expect(page).toHaveURL(/myorders/);
    });

    test('Cart goes to cart page', async ({ page }) => {
      await page.getByRole('button', { name: /Cart/ }).click();
      await expect(page).toHaveURL(/cart/);
    });

    test('Sign Out returns to login', async ({ page }) => {
      await page.getByRole('button', { name: /Sign Out/ }).click();
      await expect(page).toHaveURL(/login/);
    });
  });
});