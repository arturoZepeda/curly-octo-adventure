const xlsx = require('xlsx');             // Step 1

module.exports = {
  leeExcel : (req) => {
    const workbook = xlsx.readFile(req);  // Step 2
    let workbook_sheet = workbook.SheetNames;                // Step 3
    let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
      workbook.Sheets[workbook_sheet[0]],{header:1, blankRows: false}
    );
    return workbook_response;
  }
};