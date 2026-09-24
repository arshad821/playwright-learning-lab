const excelJS = require("exceljs");

async function fetchexcelvaluesandprint() {
  const workbook = new excelJS.Workbook();

  //js is asyncronous so should use await
  await workbook.xlsx.readFile(
    "C:\\Users\\dicetek.arshad\\Downloads\\exceldownload.xlsx",
  );
  // eachRow() goes through the worksheet one row at a time.
  // row = current row object
  // rowNumber = number of the current row
  const worksheet = workbook.getWorksheet("Sheet1");
  worksheet.eachRow((row, RowNumber) => {
    // eachCell() goes through every cell inside the current row.
    // cell = current cell object
    // columnNumber = number of the current column
    row.eachCell((cell, columnNumber) => {
      console.log(cell.value);
    });
  });
}

async function fetchexcelvaluesandgetcoordinate() {
  const workbook = new excelJS.Workbook();

  //js is asyncronous so should use await
  await workbook.xlsx.readFile(
    "C:\\Users\\dicetek.arshad\\Downloads\\exceldownload.xlsx",
  );

  const worksheet = workbook.getWorksheet("Sheet1");
  worksheet.eachRow((row, RowNumber) => {
    row.eachCell((cell, columnNumber) => {
      if (cell.value == "Kivi") {
        console.log("Row Number " + RowNumber);
        console.log("Column Number " + columnNumber);
      }
    });
  });
}

async function WriteExcelGeneric(searchtext, replaceText,change, filepath) {
  const workbook = new excelJS.Workbook();

  //js is asyncronous so should use await
  await workbook.xlsx.readFile(filepath);

  const worksheet = workbook.getWorksheet("Sheet1");

  const output = await readExcelGenricFunction(worksheet, searchtext)

  // Replace at actual location where 'Kivi' was found
  //const cell = worksheet.getCell( output.row, output.col);
  //to change the same row but diff column values, we are providing object based
  const cell = worksheet.getCell( output.row, output.col+change.changeColumn);
  cell.value = replaceText;
  try {
    //post updating we need to write it, just used try catch for catching the rror porpel=,ly
    await workbook.xlsx.writeFile(
      "C:\\Users\\dicetek.arshad\\Downloads\\exceldownload.xlsx",
    );
    console.log("Updated!");
  } catch (error) {
    if (error.code === "EBUSY") {
      console.log("File is locked. Close Excel and try again.");
    }
  }
}

 function readExcelGenricFunction(worksheet,searchtext){
//If you don't find 'Kivi', output.row and output.col stay as -1 (meaning "not found").
    let output={row:-1, col:-1}
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
//fetchexcelvaluesandprint();
//fetchexcelvaluesandgetcoordinate();
//replaceexcelcellvalue();

//WriteExcelGeneric("Apple", "Arshad", "C:\\Users\\dicetek.arshad\\Downloads\\exceldownload.xlsx");

//Traversing row/column to update the value //update banana price from 69 to 350
WriteExcelGeneric("Arshad", 350, {changeRow:0, changeColumn:2}, "C:\\Users\\dicetek.arshad\\Downloads\\exceldownload.xlsx");

/*Without it:

javascript
let output = {};  // Empty object
// If 'Kivi' not found, output.row = undefined
// Then getCell(undefined, undefined) crashes

With it:

javascript
let output = {row: -1, col: -1};  // Safe default
// If 'Kivi' not found, you get -1 (invalid cell, but won't crash)
// You can check: if(output.row === -1) console.log("Not found");

*/