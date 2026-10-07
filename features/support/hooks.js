const { chromium } = require("@playwright/test");
const { PO_Manager } = require("../../PageObjects/PO_Manager");
const { Before, After, setDefaultTimeout, Status, AfterStep, BeforeStep} = require("@cucumber/cucumber");

setDefaultTimeout(30 * 1000);
Before(async function(){
const browser = await chromium.launch({
        headless: false, //default is true, so we can see the browser
    });
    const context = await browser.newContext();
    //storing in world object so that we can access in step definition file
    this.page = await context.newPage();
    this.pomanager = new PO_Manager(this.page);
})

BeforeStep( function () {
  // This hook will be executed before all steps in a scenario with tag @foo
});

AfterStep(async function ({result}) {
  // This hook will be executed after all steps, and take a screenshot on step failure
  if (result.status === Status.FAILED) {
    await this.page.screenshot({ path: 'screenshot.png', fullPage: true });
  }
});


After(async function(){
    console.log("Browser closed am the last step to execute")
})

//tags are given in feature file
Before({tags: "@foo"}, function () {
  // This hook will be executed before scenarios tagged with @foo
});

Before({tags: "@foo and @bar"}, function () {
  // This hook will be executed before scenarios tagged with @foo and @bar
});

Before({tags: "@foo or @bar"}, function () {
  // This hook will be executed before scenarios tagged with @foo or @bar
});

// You can use the following shorthand when only specifying tags
Before("@foo", function () {
  // This hook will be executed before scenarios tagged with @foo
});