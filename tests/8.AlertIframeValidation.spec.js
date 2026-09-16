const { test ,expect} = require("@playwright/test");

test("Alert", async ({ page }) => {


    const baseURL = "https://rahulshettyacademy.com/AutomationPractice/";
    await page.goto(baseURL);

    page.once("dialog",dialog => dialog.accept());
    await page.locator("#alertbtn").click();

    page.once("dialog",dialog=> dialog.dismiss());
    await page.locator("#confirmbtn").click();

    await page.locator("#mousehover").hover();
    // Validate that the menu appeared after hovering
    await expect(page.getByText("Top")).toBeVisible();

    
});

test("Iframes", async ({ page }) => {


    const baseURL = "https://rahulshettyacademy.com/AutomationPractice/";
   
    await page.goto(baseURL);

    page.frame
    const framepage = await page.frameLocator("#courses-iframe");
    await framepage.locator("li a[href*='lifetime-access']:visible").click(); //only locate whatever element is visible

   const text =  await framepage.locator(".text h2").textContent()
   console.log(text.split(" ")[1])    
});

/*
PLAYWRIGHT - ALERT / DIALOG HANDLING

page.on("dialog", ...)
→ Listens for a browser dialog such as alert, confirm, or prompt.

dialog.accept()
→ Accepts the dialog.

dialog.dismiss()
→ Dismisses the dialog.

dialog.message()
→ Returns the message/text displayed in the dialog.

dialog.type()
→ Returns the type of dialog: "alert", "confirm", "prompt", or "beforeunload".

dialog.accept("value")
→ Accepts a prompt dialog and enters the given value before accepting.

IMPORTANT:
→ Register the dialog handler BEFORE performing the action that triggers the dialog.


The dialog handler waits for the dialog event and automatically handles it
when the dialog appears.

page.on()
→ Keep listening for every future dialog.

page.once()
→ Listen for only the next dialog, then automatically remove the listener.
*/


/*
PLAYWRIGHT - FRAME / IFRAME HANDLING

page.frameLocator("selector")
→ Creates a FrameLocator to locate and interact with elements inside an iframe.

page.frame()
→ Returns the Frame object for a specific iframe.
→ Can locate the frame using name, URL, or other frame properties.

page.frames()
→ Returns an array of all frames currently attached to the page.

page.mainFrame()
→ Returns the main/top-level frame of the page.


frame.locator("selector")
→ Locates an element inside the Frame.

frameLocator()
→ Preferred when directly locating/interacting with elements inside an iframe.


page.frame()
→ Use when you need the actual Frame object and its Frame APIs.


:visible
→ Filters the locator to only visible matching elements.
*/
