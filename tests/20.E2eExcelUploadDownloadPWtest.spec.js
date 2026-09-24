const excelJS = require("exceljs");
const { test, expect } = require("@playwright/test");

async function WriteExcelGeneric(searchtext, replaceText, change, filepath) {
  const workbook = new excelJS.Workbook();

  await workbook.xlsx.readFile(filepath);

  const worksheet = workbook.getWorksheet("Sheet1");

  const output = await readExcelGenricFunction(worksheet, searchtext);

  const cell = worksheet.getCell(output.row, output.col + change.changeColumn);
  cell.value = replaceText;
  try {
    await workbook.xlsx.writeFile(
      filepath,
    );
    console.log("Updated!");
  } catch (error) {
    if (error.code === "EBUSY") {
      console.log("File is locked. Close Excel and try again.");
    }
  }
}

function readExcelGenricFunction(worksheet, searchtext) {
  let output = { row: -1, col: -1 };
  worksheet.eachRow((row, RowNumber) => {
    row.eachCell((cell, columnNumber) => {
      if (cell.value == searchtext) {
        output.row = RowNumber;
        output.col = columnNumber;
        console.log("Found at Row " + output.row + ", Col " + output.col);
      }
    });
  });
  return output;
}

test("Excel Download & Upload", async ({ page }) => {
    const textSearch = "Papaya";
    const updatedtext = "202";
  await page.goto(
    "https://rahulshettyacademy.com/upload-download-test/index.html",
  );
  // START: Download handling
  // Step 1: Create a promise to listen for download event (before clicking). so that it will wait untile it completes
  const downloadevent =  page.waitForEvent('download')
  await page.locator("#downloadButton").click();
  // Wait for the download to complete and capture the download object
  const download = await downloadevent;
  //Get the actual filename suggested by the server (not the random temp name)
  const filename = download.suggestedFilename();
  console.log("Downloaded:", filename);
  //Create the full file path where we want to save the file
  const filepath = `C:\\Users\\dicetek.arshad\\Downloads\\${filename}`;
  //Save the downloaded file to our specified location
  await download.saveAs(filepath);
  // END: Download handling   //Note: line no 52-57 not required but we're using it beacuse facing some issue
  
  console.log("Saved to:", filepath);

  await WriteExcelGeneric(
    textSearch,
    updatedtext,
    { changeRow: 0, changeColumn: 2 },
    "C:\\Users\\dicetek.arshad\\Downloads\\download.xlsx",
  );
   // Upload the modified Excel file back to the website . will work only if it has type attribute and input tag
  await page.locator("#fileinput").setInputFiles("C:\\Users\\dicetek.arshad\\Downloads\\download.xlsx")

  //// Locator is not a Promise, so await does nothing useful
  const textLocator =  page.getByText(textSearch);
  const desiredrow =  page.getByRole('row').filter({has:textLocator});
  expect(desiredrow.locator("#cell-4-undefined")).toContainText(updatedtext);
  await page.pause()
});
