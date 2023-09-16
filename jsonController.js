const json = require('jsonfile');

const leeJSON = (req) => {
    const workbook = json.readFile(req);  // Step 2
    return workbook;
};

console.log(leeJSON('./uploads/Documento prueba.json'));