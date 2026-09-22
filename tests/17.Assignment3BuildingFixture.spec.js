const {test, expect} =  require('@playwright/test')
const {customTestbase} = require('../tests/utils/AssignmentFixture.js')

customTestbase("Newly created event should appear on the events page", async ({authenticatedPage, CreateEvent})=>{

    await authenticatedPage.goto("https://eventhub.rahulshettyacademy.com/events/");
    expect(await authenticatedPage.getByText("Techh Summit 2026")).toBeVisible();
   

})
