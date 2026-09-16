const { test ,expect,request} = require("@playwright/test");
class APIutils{
    //WHY: Store apiContext and loginPayload in the object so all API methods
    // can reuse them without passing them again and again.
    constructor(apiContext, loginPayload){
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async gettoken(){
         //login API request to get the token
           const LoginResponse=  await this.apiContext.post
           (
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            //Get the loginPayload that was stored inside this APIutils object 
            // so use this.loginPayload instead of passing it as a parameter.
            {data: this.loginPayload}
           );

           expect(LoginResponse.ok()).toBeTruthy();
           expect(LoginResponse.status()).toBe(200);
           //response.json() is asynchronous → use await.
           const LoginResponseJson = await LoginResponse.json();
           let token = LoginResponseJson.token;
           console.log(token);
           return token;
    }

    async createOrder(orderPayload){
        //create a empty js object to store the token in local storage.
        let response= {};
        //store as another property & get the token from the login API request.
        response.token = await this.gettoken();

    //order API request to place an order
    const OrderResponse = await this.apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
        // WHY: orderPayload is passed directly because only createOrder() needs it.
        // apiContext comes from the constructor, so we use this.apiContext.
        data: orderPayload,
        headers: {
            Authorization: response.token,
            "Content-Type": "application/json"
        }
    });

   console.log("Status:", OrderResponse.status());
   console.log("Response:", await OrderResponse.text());

    expect(OrderResponse.ok()).toBeTruthy();
    expect(OrderResponse.status()).toBe(201);

    const OrderResponseJson = await OrderResponse.json();
    console.log(OrderResponseJson); 
    expect(OrderResponseJson.message).toBe("Order Placed Successfully");
    let OrderID = OrderResponseJson.orders[0];
    //store the order id in the response object to use it in the test file.
    response.OrderID = OrderID;
    return response;
    }
}

module.exports = APIutils;