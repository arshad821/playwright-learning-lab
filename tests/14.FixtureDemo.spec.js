const {test, expect} =  require('@playwright/test')
const {customTestbase} = require('../tests/utils/Fixture.js')

customTestbase("Fixture Demo Test", async ({authenticatedPage, CreateOrder, TestDataForOrder})=>{

    // authenticatedPage = page provided by use(page)
    // Login is already completed by the fixture.
    await authenticatedPage.goto("https://rahulshettyacademy.com/client/");

    const myorderButton = await authenticatedPage.locator("[routerlink*='myorders']");
    await myorderButton.first().click();
    //just validating the order id which is created by the api response which is stored in CreateOrder
    //console.log("CreateOrder :", CreateOrder);
    await expect(authenticatedPage.getByText(CreateOrder.OrderID)).toBeVisible();

    //It can be accessed with property name
   console.log(TestDataForOrder.ProductName)

})
