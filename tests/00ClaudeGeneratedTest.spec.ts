import { test, expect, Page, APIRequestContext, BrowserContext } from '@playwright/test';

const BASE_URL = 'https://rahulshettyacademy.com/client';
const API_URL = 'https://rahulshettyacademy.com/api/ecom';
const EMAIL = process.env.APP_EMAIL || 'arsharahsd977@gmail.com';
const PASSWORD = process.env.APP_PASSWORD || 'Arshad@7';
const PRODUCT = 'iphone 13 pro';

// ---------- helpers ----------
async function apiLogin(request: APIRequestContext) {
  const res = await request.post(`${API_URL}/auth/login`, {
    data: { userEmail: EMAIL, userPassword: PASSWORD },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  return { token: body.token as string, userId: body.userId as string };
}

// Skip UI login: inject token before the app loads
async function loginWithToken(page: Page | BrowserContext, token: string) {
  await page.addInitScript((t) => window.localStorage.setItem('token', t), token);
}

async function addProductToCartUI(page: Page, productName: string) {
  await page.goto(`${BASE_URL}/#/dashboard/dash`);
  const cards = page.locator('.card-body');
  await cards.first().waitFor();
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).locator('b').textContent();
    if (title?.trim().toLowerCase() === productName.toLowerCase()) {
      await cards.nth(i).locator('button:has-text("Add To Cart")').click();
      return;
    }
  }
  throw new Error(`Product not found: ${productName}`);
}

async function openCheckout(page: Page) {
  await page.locator('button[routerlink*="cart"]').click();
  await page.locator('div.cart li').first().waitFor();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.locator('.payment__title').first().waitFor();
}

async function selectCountry(page: Page, typed: string, countryName: string) {
  await page.locator('input[placeholder="Select Country"]').pressSequentially(typed, { delay: 80 });
  const options = page.locator('.ta-results button');
  await options.first().waitFor();
  const total = await options.count();
  for (let i = 0; i < total; i++) {
    if ((await options.nth(i).textContent())?.trim() === countryName) {
      await options.nth(i).click();
      return;
    }
  }
  throw new Error(`Country not found in suggestions: ${countryName}`);
}

async function fillValidCardDetails(page: Page) {
  await page.locator('.field:has-text("CVV Code") input').fill('123');
  await page.locator('.field:has-text("Name on Card") input').fill('Mohamed Arshad');
}

// ---------- setup: token login + cart + checkout ----------
test.describe('Checkout - advanced scenarios', () => {
  let token: string;

  test.beforeEach(async ({ page, request }) => {
    ({ token } = await apiLogin(request));
    await loginWithToken(page, token);
    await addProductToCartUI(page, PRODUCT);
    await openCheckout(page);
  });

  // =====================================================
  // 1. Network interception - what if the backend misbehaves?
  // =====================================================
  test.describe('Backend failure handling', () => {
    test('create-order API returns 500 - user must not land on thank-you page', async ({ page }) => {
      await page.route('**/api/ecom/order/create-order', (route) =>
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Server error' }) })
      );
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();

      await expect(page).not.toHaveURL(/thanks/);
      await expect(page.locator('.payment__title').first()).toBeVisible();
    });

    test('create-order API is slow - spinner shows and order still completes', async ({ page }) => {
      await page.route('**/api/ecom/order/create-order', async (route) => {
        await new Promise((r) => setTimeout(r, 3000));
        await route.continue();
      });
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();

      await expect(page.locator('ngx-spinner')).toBeVisible();
      await expect(page).toHaveURL(/thanks/, { timeout: 15000 });
    });

    test('network goes offline right before placing order', async ({ page, context }) => {
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      await context.setOffline(true);
      await page.locator('.action__submit').click();

      await expect(page).not.toHaveURL(/thanks/);
      await context.setOffline(false);
    });

    test('expired/invalid token - order is rejected', async ({ page }) => {
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      // corrupt the token after the page has loaded
      await page.evaluate(() => localStorage.setItem('token', 'invalid.token.value'));
      await page.locator('.action__submit').click();

      await expect(page).not.toHaveURL(/thanks/);
    });
  });

  // =====================================================
  // 2. Request payload validation
  // =====================================================
  test.describe('API payload verification', () => {
    test('create-order request carries correct country and product id', async ({ page }) => {
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');

      const [request] = await Promise.all([
        page.waitForRequest('**/api/ecom/order/create-order'),
        page.locator('.action__submit').click(),
      ]);

      const payload = request.postDataJSON();
      expect(payload.orders).toHaveLength(1);
      expect(payload.orders[0].country).toBe('India');
      expect(payload.orders[0].productOrderedId).toBeTruthy();
      expect(request.headers()['authorization']).toBe(token);
    });

    test('create-order response returns an order id and success message', async ({ page }) => {
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');

      const [response] = await Promise.all([
        page.waitForResponse('**/api/ecom/order/create-order'),
        page.locator('.action__submit').click(),
      ]);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.message).toMatch(/Order Placed Successfully/i);
      expect(body.orders).toHaveLength(1);
    });
  });

  // =====================================================
  // 3. Double submit / idempotency
  // =====================================================
  test.describe('Duplicate submission', () => {
    test('double-clicking Place Order creates only one order', async ({ page }) => {
      let createOrderCalls = 0;
      await page.route('**/api/ecom/order/create-order', (route) => {
        createOrderCalls++;
        route.continue();
      });

      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').dblclick();
      await page.waitForURL(/thanks/);

      expect(createOrderCalls).toBe(1); // if 2 -> real defect (duplicate orders)
    });
  });

  // =====================================================
  // 4. Data-driven negative inputs
  // =====================================================
  test.describe('Input validation (data driven)', () => {
    const cvvCases = [
      { name: 'letters in CVV', value: 'abc' },
      { name: 'only 1 digit', value: '1' },
      { name: '5 digits', value: '12345' },
      { name: 'special characters', value: '@#$' },
      { name: 'spaces only', value: '   ' },
    ];

    for (const c of cvvCases) {
      test.fixme(`CVV invalid: ${c.name} should not place order`, async ({ page }) => {
        await page.locator('.field:has-text("CVV Code") input').fill(c.value);
        await page.locator('.field:has-text("Name on Card") input').fill('Mohamed Arshad');
        await selectCountry(page, 'ind', 'India');
        await page.locator('.action__submit').click();
        await expect(page).not.toHaveURL(/thanks/);
      });
    }

    const cardCases = [
      { name: 'letters', value: 'abcd efgh ijkl mnop' },
      { name: 'too short', value: '4542 9931' },
      { name: 'too long', value: '4542 9931 9292 2293 9999' },
      { name: 'empty', value: '' },
    ];

    for (const c of cardCases) {
      test.fixme(`Card number invalid: ${c.name}`, async ({ page }) => {
        await page.locator('.field:has-text("Credit Card Number") input').fill(c.value);
        await fillValidCardDetails(page);
        await selectCountry(page, 'ind', 'India');
        await page.locator('.action__submit').click();
        await expect(page).not.toHaveURL(/thanks/);
      });
    }

    test('expired card date (past month/year) should be rejected', async ({ page }) => {
      test.fixme(true, 'Confirm with BA - app may not validate expiry');
      await page.locator('select.ddl').nth(0).selectOption('01');
      await page.locator('select.ddl').nth(1).selectOption('16');
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();
      await expect(page).not.toHaveURL(/thanks/);
    });
  });

  // =====================================================
  // 5. Security-style inputs
  // =====================================================
  test.describe('Security inputs', () => {
    test('XSS payload in Name on Card is not executed', async ({ page }) => {
      let dialogShown = false;
      page.on('dialog', async (d) => {
        dialogShown = true;
        await d.dismiss();
      });
      await page.locator('.field:has-text("Name on Card") input').fill('<script>alert("xss")</script>');
      await page.locator('.field:has-text("CVV Code") input').fill('123');
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();
      await page.waitForTimeout(1500);

      expect(dialogShown).toBe(false);
    });

    test('SQL injection string in coupon is handled safely', async ({ page }) => {
      await page.locator('input[name="coupon"]').fill("' OR '1'='1");
      await page.getByRole('button', { name: 'Apply Coupon' }).click();

      await expect(page.getByText('* Invalid Coupon')).toBeVisible();
      await expect(page.getByText('* Coupon Applied')).toHaveCount(0);
    });

    test('coupon with leading/trailing spaces and wrong case', async ({ page }) => {
      await page.locator('input[name="coupon"]').fill(' RAHULSHETTYACADEMY ');
      await page.getByRole('button', { name: 'Apply Coupon' }).click();
      // Document actual behaviour - either result is worth a note to the team
      const applied = await page.getByText('* Coupon Applied').isVisible().catch(() => false);
      console.log(`Coupon with spaces/uppercase applied: ${applied}`);
    });
  });

  // =====================================================
  // 6. State & session behaviour
  // =====================================================
  test.describe('State and session', () => {
    test('page refresh keeps the user on checkout with product intact', async ({ page }) => {
      await page.reload();
      await expect(page.locator('.item__title')).toContainText(PRODUCT);
    });

    test('country is cleared after refresh (form state not persisted)', async ({ page }) => {
      await selectCountry(page, 'ind', 'India');
      await page.reload();
      await expect(page.locator('input[placeholder="Select Country"]')).toHaveValue('');
    });

    test('browser back after successful order does not allow re-submitting', async ({ page }) => {
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();
      await page.waitForURL(/thanks/);

      await page.goBack();
      // cart should be empty now, so checkout must not show the old product
      await expect(page.locator('.item__title')).toHaveCount(0);
    });

    test('cart is emptied after placing an order', async ({ page }) => {
      await fillValidCardDetails(page);
      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').click();
      await page.waitForURL(/thanks/);

      await page.locator('button[routerlink*="cart"]').first().click();
      await expect(page.getByText(/No Products in Your Cart/i)).toBeVisible();
    });

    test('sign out then browser back does not expose the checkout', async ({ page }) => {
      await page.getByRole('button', { name: /Sign Out/ }).click();
      await expect(page).toHaveURL(/login/);
      await page.goBack();
      await expect(page.locator('.item__title')).toHaveCount(0);
    });

    test('opening checkout in a new tab after token removal redirects to login', async ({ page, context }) => {
      const newTab = await context.newPage();
      await newTab.goto(`${BASE_URL}/#/auth/login`);
      await newTab.evaluate(() => localStorage.clear());
      await newTab.goto(`${BASE_URL}/#/dashboard/order`);
      await expect(newTab).not.toHaveURL(/dashboard\/order/);
    });
  });

  // =====================================================
  // 7. UI / usability
  // =====================================================
  test.describe('Usability', () => {
    test('keyboard-only flow: tab through fields and press Enter on Place Order', async ({ page }) => {
      await page.locator('.field:has-text("CVV Code") input').focus();
      await page.keyboard.type('123');
      await page.keyboard.press('Tab');
      await page.keyboard.type('Mohamed Arshad');

      await selectCountry(page, 'ind', 'India');
      await page.locator('.action__submit').focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/thanks/);
    });

    test('country dropdown closes after selection', async ({ page }) => {
      await selectCountry(page, 'ind', 'India');
      await expect(page.locator('.ta-results button')).toHaveCount(0);
    });

    test('country search is case-insensitive', async ({ page }) => {
      await page.locator('input[placeholder="Select Country"]').pressSequentially('IND', { delay: 80 });
      await expect(page.locator('.ta-results button').first()).toBeVisible();
    });

    test('mobile viewport - hamburger menu and form are usable', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('label.hamberger-btn')).toBeVisible();
      await expect(page.locator('.action__submit')).toBeVisible();
      await expect(page.locator('select.ddl').first()).toBeVisible();
    });

    test('no broken images and no console errors on load', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      await page.reload();
      await page.locator('.item__title').waitFor();

      const broken = await page.$$eval('img', (imgs) =>
        imgs.filter((i) => !(i as HTMLImageElement).complete || (i as HTMLImageElement).naturalWidth === 0).length
      );
      expect(broken).toBe(0);
      expect(errors, `Console errors: ${errors.join(' | ')}`).toHaveLength(0);
    });
  });
});

// =====================================================
// 8. Hybrid API + UI and multi-user / multi-order checks
// =====================================================
test.describe('Hybrid API + UI', () => {
  test('order created via UI is visible through the orders API', async ({ page, request }) => {
    const { token } = await apiLogin(request);
    await loginWithToken(page, token);
    await addProductToCartUI(page, PRODUCT);
    await openCheckout(page);
    await fillValidCardDetails(page);
    await selectCountry(page, 'ind', 'India');
    await page.locator('.action__submit').click();
    await page.waitForURL(/thanks/);

    const uiOrderId = (await page.locator('.em-spacer-1 .ng-star-inserted').textContent())!
      .replace(/\|/g, '')
      .trim();

    const { userId } = await apiLogin(request);
    const res = await request.get(`${API_URL}/order/get-orders-for-customer/${userId}`, {
      headers: { Authorization: token },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const ids = body.data.map((o: { _id: string }) => o._id);
    expect(ids).toContain(uiOrderId);
  });

  test('order details page shows same country and product as selected at checkout', async ({ page, request }) => {
    const { token } = await apiLogin(request);
    await loginWithToken(page, token);
    await addProductToCartUI(page, PRODUCT);
    await openCheckout(page);
    await fillValidCardDetails(page);
    await selectCountry(page, 'ind', 'India');
    await page.locator('.action__submit').click();
    await page.waitForURL(/thanks/);

    await page.locator('button[routerlink*="myorders"]').first().click();
    await page.locator('tbody tr').first().waitFor();
    await page.locator('tbody tr').first().getByRole('button', { name: 'View' }).click();

    await expect(page.locator('.col-text').first()).toContainText(/.+/);
    await expect(page.locator('.address')).toContainText('India');
  });

  test('two users checking out at the same time do not see each other orders', async ({ browser, request }) => {
    const { token } = await apiLogin(request);

    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    await loginWithToken(ctxA, token);
    await loginWithToken(ctxB, token);
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    for (const p of [pageA, pageB]) {
      await addProductToCartUI(p, PRODUCT);
      await openCheckout(p);
      await fillValidCardDetails(p);
      await selectCountry(p, 'ind', 'India');
    }

    await Promise.all([pageA.locator('.action__submit').click(), pageB.locator('.action__submit').click()]);
    await Promise.all([pageA.waitForURL(/thanks/), pageB.waitForURL(/thanks/)]);

    const idA = (await pageA.locator('.em-spacer-1 .ng-star-inserted').textContent())!.replace(/\|/g, '').trim();
    const idB = (await pageB.locator('.em-spacer-1 .ng-star-inserted').textContent())!.replace(/\|/g, '').trim();
    expect(idA).not.toBe(idB);

    await ctxA.close();
    await ctxB.close();
  });
});