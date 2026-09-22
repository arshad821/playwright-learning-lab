const { test: base, expect } = require("@playwright/test");

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const API_URL = "https://api.eventhub.rahulshettyacademy.com/api";
const yahoo_login_payload = {
  email: "yahoo@yahoo.com",
  password: "Arshad@7",
};

exports.customTestbase = base.extend({
    // Task 1: UI login fixture — returns an already-authenticated page
  authenticatedPage: async ({ page }, use) => {
    //const context = await browser.newContext();
   // const page = await context.newPage();
    await page.goto(BASE_URL);
    await page.locator("#email").fill("yahoo@yahoo.com");
    await page.locator("#password").fill("Arshad@7");
    await page.locator("#login-btn").click();

    await page.locator("#event-card").first().waitFor();

    await use(page);
    //The fixture closes the context AFTER use(page) finishes.
    //await page.close();

  },

  // Task 2: API event-creation fixture — returns the created event's data
  CreateEvent: async ({ request }, use) => {
    const login_response = await request.post(API_URL + "/auth/login", {
      data: yahoo_login_payload,
    });

    //login and pass as bearer token
    const loginresponse_json = await login_response.json();
    await expect(login_response.ok()).toBeTruthy();
    const token = loginresponse_json.token;
    console.log(token); //check

    //create Event
    const  CreateeventResponse = await request.post(API_URL + "/events", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: {
        title: "Techh Summit 2026",
        description: "A premier technology conference.",
        category: "Conference",
        venue: "Bangalore International Centre",
        city: "Bangalore",
        eventDate: "2027-06-15T09:00:00.000Z",
        price: 1500,
        totalSeats: 500,
        imageUrl: "https://example.com/banner.jpg",
      },
    });
    console.log(CreateeventResponse);
    //if some error use this to know the response text
    console.log(await CreateeventResponse.text());
    expect(CreateeventResponse.ok()).toBeTruthy();
    expect(CreateeventResponse.status()).toBe(201);

    
      const EventResponseData = await CreateeventResponse.json();
      console.log(EventResponseData);
      console.log("Event booking created via API. ID : "+EventResponseData.data.id) 
      let CreatedEventid = EventResponseData.data.id;
      console.log("Event booking name created via API. Name : "+EventResponseData.data.title) 
      let CreatedEventname = EventResponseData.data.title;
      await use(EventResponseData)
  },
});

exports.expect = expect;