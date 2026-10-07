import { test, expect } from "@playwright/test";
import {PO_Manager } from "../PageObjects_TS/PO_Manager";

//converting json to string and converting to js object
const dataset = JSON.parse(
  JSON.stringify(require("./utils/22.E2E_DiffTestDataSets.json")),
);


//paremetrizing test with JSON payload by storing the json in array
for(const data of dataset)
{
    //ensure test name also dynamically changes
  test("E2E Order Placement for Product : " + data.productName, async ({ page }) => {
    const pomanager = new PO_Manager(page);
    //LoginPage constructor expects page.
    const loginpage = pomanager.getloginpage();
    const dashboardpage = pomanager.getdashboardpage();
    const checkoutPage = pomanager.getcheckoutpage();
    const fillorderinfoPage = pomanager.getfillorderinfopage();
    const orderconfirmpage = pomanager.getorderConfirmpage();
    const orderlistingpage = pomanager.getOrderlistingpage();

    //async mehtods must needed to written with await
    await loginpage.goTo();
    await loginpage.ValidLogin(data.username, data.password);
    await expect(loginpage.toastpopupmsg).toContainText("Login Successfully");
    // await page.waitForLoadState('networkidle');

    await dashboardpage.SearchProductAndAddCart(data.productName);
    await expect(dashboardpage.toastpopupmsg).toContainText(
      "Product Added To Cart",
    );

    await dashboardpage.navigateTocart();
    //await expect(page.locator("h3:has-text('ZARA COAT 3')")).toBeVisible(); // did in checkout po

    await checkoutPage.clickCheckout();
    await expect(checkoutPage.getProduct(data.productName)).toBeVisible();

    await fillorderinfoPage.searchCountryAndSelect(
      data.countrycode,
      data.countryName,
    );
    await fillorderinfoPage.VerifyUsernameandclickPlaceOrder(data.username);
    await expect(orderconfirmpage.orderConfirmationMsg).toHaveText(
      " Thankyou for the order. ",
    );

    const OrderID: any = await orderconfirmpage.verifyOrderIDandClickMyOrder();
    await orderlistingpage.VerifyOrderid(OrderID);
  });
}
