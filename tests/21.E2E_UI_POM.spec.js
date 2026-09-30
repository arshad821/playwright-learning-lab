
const { test ,expect} = require("@playwright/test");
const {PO_Manager} = require("../PageObjects/PO_Manager");
const { stringify } = require("node:querystring");
//converting json to string and converting to js object
const dataset = JSON.parse((JSON.stringify(require("./utils/21.E2E_UI_POM_TestData.json"))));

test("E2E Order Placement - Page Object Model", async ({ page }) => {

    const pomanager = new PO_Manager(page);
    //LoginPage constructor expects page.
    const loginpage = pomanager.getloginpage()
    const dashboardpage = pomanager.getdashboardpage();
    const checkoutPage = pomanager.getcheckoutpage();
    const fillorderinfoPage = pomanager.getfillorderinfopage();
    const orderconfirmpage = pomanager.getorderConfirmpage();
    const orderlistingpage = pomanager.getOrderlistingpage();

    //async mehtods must needed to written with await
    await loginpage.goTo();
    await loginpage.ValidLogin(dataset.username,dataset.password);
    await expect(loginpage.toastpopupmsg).toContainText("Login Successfully");
   // await page.waitForLoadState('networkidle');

    await dashboardpage.SearchProductAndAddCart(dataset.productName);
    await expect(dashboardpage.toastpopupmsg).toContainText("Product Added To Cart");


    await dashboardpage.navigateTocart();
    //await expect(page.locator("h3:has-text('ZARA COAT 3')")).toBeVisible(); // did in checkout po

    await checkoutPage.clickCheckout();
    await expect(checkoutPage.getProduct(dataset.productName)).toBeVisible()

    await fillorderinfoPage.searchCountryAndSelect(dataset.countrycode,dataset.countryName)
    await fillorderinfoPage.VerifyUsernameandclickPlaceOrder(dataset.username)
    await expect(orderconfirmpage.orderConfirmationMsg).toHaveText(" Thankyou for the order. ");

    const OrderID = await orderconfirmpage.verifyOrderIDandClickMyOrder()
    await orderlistingpage.VerifyOrderid(OrderID);

    

         
});


/*

Test
 ↓
page
 ↓
PO_Manager(page)
 ↓
 ├── LoginPage(page)
 ├── DashboardPage(page)
 └── CheckoutPage(page)

 */