# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo.spec.ts >> Checkout / Order screen >> Payment methods >> all four payment methods are listed
- Location: tests\demo.spec.ts:81:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.card-body').first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic: Ecom
      - generic [ref=e9]:
        - link " dummywebsite@rahulshettyacademy.com" [ref=e11] [cursor=pointer]:
          - /url: emailto:dummywebsite@rahulshettyacademy.com
          - generic [ref=e12]: 
          - text: dummywebsite@rahulshettyacademy.com
        - generic [ref=e13]:
          - link "" [ref=e14] [cursor=pointer]:
            - /url: "#"
          - link "" [ref=e16] [cursor=pointer]:
            - /url: "#"
          - link "" [ref=e18] [cursor=pointer]:
            - /url: "#"
          - link "" [ref=e20] [cursor=pointer]:
            - /url: "#"
  - generic [ref=e22]:
    - generic [ref=e23]:
      - heading "We Make Your Shopping Simple" [level=3]
      - heading [level=1] [ref=e24]:
        - text: Practice Website for
        - emphasis [ref=e25]: Rahul Shetty Academy
        - text: Students
      - link "Register" [ref=e26] [cursor=pointer]:
        - /url: "#/auth/register"
    - generic [ref=e28]:
      - paragraph [ref=e29]:
        - generic [ref=e30]: Register to sign in with your personal account
      - generic [ref=e31]:
        - heading "Log in" [level=1] [ref=e32]
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic [ref=e35]: Email
            - textbox "email@example.com" [ref=e36]: arsharahsd977@gmail.com
          - generic [ref=e37]:
            - generic [ref=e38]: Password
            - textbox "enter your passsword" [ref=e39]: your-password
          - button "Login" [active] [ref=e40] [cursor=pointer]
        - link "Forgot password?" [ref=e41] [cursor=pointer]:
          - /url: "#/auth/password-new"
        - paragraph [ref=e42] [cursor=pointer]: Don't have an account? Register here
  - generic [ref=e43]:
    - heading "Why People Choose Us?" [level=1] [ref=e46]
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]: 
        - generic [ref=e51]:
          - heading "3546540" [level=1]
          - paragraph [ref=e52]: Successfull Orders
      - generic [ref=e53]:
        - generic [ref=e54]: 
        - generic [ref=e56]:
          - heading "37653" [level=1]
          - paragraph [ref=e57]: Customers
      - generic [ref=e58]:
        - generic [ref=e59]: 
        - generic [ref=e61]:
          - heading "3243" [level=1]
          - paragraph [ref=e62]: Sellers
    - generic [ref=e63]:
      - generic [ref=e64]:
        - generic [ref=e65]: 
        - generic [ref=e67]:
          - heading "4500+" [level=1]
          - paragraph [ref=e68]: Daily Orders
      - generic [ref=e69]:
        - generic [ref=e70]: 
        - generic [ref=e72]:
          - heading "500+" [level=1]
          - paragraph [ref=e73]: Daily New Customer Joining
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'https://rahulshettyacademy.com/client';
  4   | const EMAIL = process.env.APP_EMAIL || 'arsharahsd977@gmail.com';
  5   | const PASSWORD = process.env.APP_PASSWORD || 'Arshad@7';
  6   | const PRODUCT = 'iphone 13 pro';
  7   | 
  8   | // ---------- helpers ----------
  9   | async function login(page:Page) {
  10  |   await page.goto(`${BASE_URL}/#/auth/login`);
  11  |   await page.locator('#userEmail').fill(EMAIL);
  12  |   await page.locator('#userPassword').fill(PASSWORD);
  13  |   await page.locator('#login').click();
  14  |   await page.waitForLoadState('networkidle');
  15  | }
  16  | 
  17  | async function addProductToCart(page: Page, productName: string) {
  18  |   const cards = page.locator('.card-body');
  19  |   const count = await cards.count();
  20  |   for (let i = 0; i < count; i++) {
  21  |     const title = await cards.nth(i).locator('b').textContent();
  22  |     if (title?.trim().toLowerCase() === productName.toLowerCase()) {
  23  |       await cards.nth(i).locator('button:has-text("Add To Cart")').click();
  24  |       break;
  25  |     }
  26  |   }
  27  | }
  28  | 
  29  | async function goToCheckout(page: Page) {
  30  |   await page.locator('button[routerlink*="cart"]').click();
  31  |   await page.locator('div.cart li').first().waitFor();
  32  |   await page.getByRole('button', { name: 'Checkout' }).click();
  33  |   await page.locator('.payment__title').first().waitFor();
  34  | }
  35  | 
  36  | async function selectCountry(page: Page, typed: string, countryName: string) {
  37  |   const country = page.locator('input[placeholder="Select Country"]');
  38  |   await country.pressSequentially(typed, { delay: 100 });
  39  |   const options = page.locator('.ta-results button');
  40  |   await options.first().waitFor();
  41  |   const total = await options.count();
  42  |   for (let i = 0; i < total; i++) {
  43  |     const text = (await options.nth(i).textContent())?.trim();
  44  |     if (text === countryName) {
  45  |       await options.nth(i).click();
  46  |       break;
  47  |     }
  48  |   }
  49  | }
  50  | 
  51  | // ---------- tests ----------
  52  | test.describe('Checkout / Order screen', () => {
  53  |   test.beforeEach(async ({ page }) => {
  54  |     await login(page);
> 55  |     await page.locator('.card-body').first().waitFor();
      |                                              ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  56  |     await addProductToCart(page, PRODUCT);
  57  |     await goToCheckout(page);
  58  |   });
  59  | 
  60  |   // ===== Page load & product summary =====
  61  |   test.describe('Page load and product summary', () => {
  62  |     test('shows product details correctly', async ({ page }) => {
  63  |       await expect(page.locator('.item__title')).toContainText(PRODUCT);
  64  |       await expect(page.locator('.item__price')).toContainText('$');
  65  |       await expect(page.locator('.item__quantity')).toContainText('Quantity: 1');
  66  |       await expect(page.locator('.item__description li').first()).toBeVisible();
  67  |       await expect(page.locator('img.iphone')).toBeVisible();
  68  |     });
  69  | 
  70  |     test('cart badge shows 1 item', async ({ page }) => {
  71  |       await expect(page.locator('button:has-text("Cart") label')).toHaveText('1');
  72  |     });
  73  | 
  74  |     test('logged-in email is displayed in shipping section', async ({ page }) => {
  75  |       await expect(page.locator('.user__name label')).toHaveText(EMAIL);
  76  |     });
  77  |   });
  78  | 
  79  |   // ===== Payment methods =====
  80  |   test.describe('Payment methods', () => {
  81  |     test('all four payment methods are listed', async ({ page }) => {
  82  |       const types = page.locator('.payment__type');
  83  |       await expect(types).toHaveCount(4);
  84  |       await expect(types).toHaveText([/Credit Card/, /Paypal/, /SEPA/, /Invoice/]);
  85  |     });
  86  | 
  87  |     test('credit card is selected by default', async ({ page }) => {
  88  |       await expect(page.locator('.payment__type--cc')).toHaveClass(/active/);
  89  |     });
  90  | 
  91  |     test('card number field is prefilled', async ({ page }) => {
  92  |       await expect(page.locator('.field:has-text("Credit Card Number") input'))
  93  |         .toHaveValue('4542 9931 9292 2293');
  94  |     });
  95  |   });
  96  | 
  97  |   // ===== Card form fields =====
  98  |   test.describe('Card details form', () => {
  99  |     test('expiry month and year defaults and options', async ({ page }) => {
  100 |       const month = page.locator('select.ddl').nth(0);
  101 |       const year = page.locator('select.ddl').nth(1);
  102 |       await expect(month).toHaveValue('01');
  103 |       await expect(year).toHaveValue('16');
  104 |       await expect(month.locator('option')).toHaveCount(12);
  105 |       await expect(year.locator('option')).toHaveCount(31);
  106 |     });
  107 | 
  108 |     test('user can change expiry month and year', async ({ page }) => {
  109 |       const month = page.locator('select.ddl').nth(0);
  110 |       const year = page.locator('select.ddl').nth(1);
  111 |       await month.selectOption('08');
  112 |       await year.selectOption('25');
  113 |       await expect(month).toHaveValue('08');
  114 |       await expect(year).toHaveValue('25');
  115 |     });
  116 | 
  117 |     test('user can enter CVV and name on card', async ({ page }) => {
  118 |       const cvv = page.locator('.field:has-text("CVV Code") input');
  119 |       const name = page.locator('.field:has-text("Name on Card") input');
  120 |       await cvv.fill('123');
  121 |       await name.fill('Mohamed Arshad');
  122 |       await expect(cvv).toHaveValue('123');
  123 |       await expect(name).toHaveValue('Mohamed Arshad');
  124 |     });
  125 | 
  126 |     test('card number can be edited', async ({ page }) => {
  127 |       const card = page.locator('.field:has-text("Credit Card Number") input');
  128 |       await card.fill('4111 1111 1111 1111');
  129 |       await expect(card).toHaveValue('4111 1111 1111 1111');
  130 |     });
  131 |   });
  132 | 
  133 |   // ===== Coupon =====
  134 |   test.describe('Coupon', () => {
  135 |     test('valid coupon is applied', async ({ page }) => {
  136 |       await page.locator('input[name="coupon"]').fill('rahulshettyacademy');
  137 |       await page.getByRole('button', { name: 'Apply Coupon' }).click();
  138 |       await expect(page.getByText('* Coupon Applied')).toBeVisible();
  139 |     });
  140 | 
  141 |     test('invalid coupon shows error', async ({ page }) => {
  142 |       await page.locator('input[name="coupon"]').fill('WRONG123');
  143 |       await page.getByRole('button', { name: 'Apply Coupon' }).click();
  144 |       await expect(page.getByText('* Invalid Coupon')).toBeVisible();
  145 |     });
  146 | 
  147 |     test('empty coupon does not apply anything', async ({ page }) => {
  148 |       await page.getByRole('button', { name: 'Apply Coupon' }).click();
  149 |       await expect(page.getByText('* Coupon Applied')).toHaveCount(0);
  150 |     });
  151 |   });
  152 | 
  153 |   // ===== Country autocomplete =====
  154 |   test.describe('Country selection', () => {
  155 |     test('suggestions appear while typing', async ({ page }) => {
```