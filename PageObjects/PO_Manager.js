const {LoginPage}=require("./LoginPage")
const {DashboardPage}=require("./DashboardPage")
const {CheckoutPage} = require("./CheckoutPage")
const {FillOrderInfoPage} = require("./FillOrderInfoPage")
const {OrderConfirmationPage} = require("./OrderConfirmationPage")
const {OrderListPage} = require("./OrderListPage")

class PO_Manager{

    constructor(page){
        // WHY: Pass the same Playwright page to every Page Object
        this.loginpage = new LoginPage(page);
        this.dashboardpage = new DashboardPage(page);
        this.checkoutpage = new CheckoutPage(page);
        this.fillorderinfopage = new FillOrderInfoPage(page);
        this.orderconfirmpage = new OrderConfirmationPage(page);
        this.orderlistingpage = new OrderListPage(page);
    }

    getloginpage(){
        return this.loginpage;
    }

    getdashboardpage(){
        return this.dashboardpage;
    }

    getcheckoutpage(){
        return this.checkoutpage;
    }

    getfillorderinfopage(){
        return this.fillorderinfopage;
    }

    getorderConfirmpage(){
        return this.orderconfirmpage;
    }

    getOrderlistingpage(){
        return this.orderlistingpage;
    }
}

module.exports = { PO_Manager };


/*

Playwright creates page
        ↓
new PO_Manager(page)
        ↓
PO_Manager passes page
   ↙         ↓          ↘
LoginPage  Dashboard   Checkout

So PO Manager's job is basically to create/manage all your Page Objects in one place.
PO Manager centralizes the creation of Page Objects and makes the test cleaner.

*/


/*
Could you avoid the constructor?

Yes. For example:

class PO_Manager {

    getloginpage(page) {
        return new LoginPage(page);
    }

    getdashboardpage(page) {
        return new DashboardPage(page);
    }

    getcheckoutpage(page) {
        return new CheckoutPage(page);
    }
}

Then:

const poManager = new PO_Manager();

const loginpage = poManager.getloginpage(page);
const dashboardpage = poManager.getdashboardpage(page);
const checkoutpage = poManager.getcheckoutpage(page);

This works.

But notice you're now passing page repeatedly:

getloginpage(page)
getdashboardpage(page)
getcheckoutpage(page)

Whereas with the constructor:

const poManager = new PO_Manager(page);

you pass it once, and the manager stores the Page Objects.

🧠 The main idea
Constructor approach:

page → PO_Manager
          ↓
     stores page objects
       ↙    ↓     ↘
   Login  Dashboard Checkout

So constructor isn't mandatory.*/