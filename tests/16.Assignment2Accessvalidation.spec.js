const { test, request, expect } = require("@playwright/test");

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const API_URL = "https://api.eventhub.rahulshettyacademy.com/api";

const yahoo_login_payload = {
  email: "yahoo@yahoo.com",
  password: "Arshad@7",
};

const email_payload = {
  email: "email@email.com",
  password: "Arshad@7",
};

async function loginGmailuser(page, user) {
  await page.goto("https://eventhub.rahulshettyacademy.com/login");
  await page.locator("#email").fill(user.email);
  await page.locator("#password").fill(user.password);
  await page.locator("#login-btn").click();

  await page.locator("#event-card").first().waitFor();
}

test("gmail user sees Access Denied when viewing yahoo user booking", async ({
  request,page
}) => {
  //1.login for yahoo user through API
  let login_response = await request.post(API_URL + "/auth/login", {
    data: yahoo_login_payload,
  });
  const loginresponse_json = await login_response.json();
  console.log(loginresponse_json);
  await expect(login_response.ok()).toBeTruthy();
  const token = loginresponse_json.token;
  console.log(token); //check

  //2.Fetch events via API to get a valid event ID
  const eventsResponse = await request.get(API_URL + "/events", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  expect(eventsResponse.ok()).toBeTruthy();
  const eventsData = await eventsResponse.json();
  console.log(eventsData);
  console.log("Stored Data id for further use"+eventsData.data[0].id) 
  let dataEventId = eventsData.data[0].id;


  //3.Create a booking via API as Yahoo user
  const CreateBookingResponse = await request.post(API_URL + "/bookings", 
    {
        headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: {
      eventId: dataEventId,
      customerName: "Priya YahooUser",
      customerEmail: "yahoo@yahoo.com",
      customerPhone: "+91-9876543210",
      quantity: 2
    }
    })

      expect(CreateBookingResponse.ok()).toBeTruthy();
      expect(CreateBookingResponse.status()).toBe(201);

      const BookingResponseData = await CreateBookingResponse.json();
      console.log(BookingResponseData);
      console.log("Yahoo booking created via API. ID : "+BookingResponseData.data.id) 
      let yahooBookingId = BookingResponseData.data.id;

      //4.    Login as Gmail user via browser UI
      await loginGmailuser(page, email_payload)

      //5.   Navigate to Yahoo's booking URL as Gmail user
      await page.goto(BASE_URL+ "/bookings/"+yahooBookingId,  { waitUntil: 'networkidle' } );

      //6.  Validate Access Denied  ───────────────────────────────────────
      expect(await page.getByText("Access Denied")).toBeVisible();
      expect(await page.getByText("You are not authorized to view this booking")).toBeVisible();

});
