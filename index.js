// Import dependencies
const { leeExcel } = require('./excelController');
//const { leeJSON } = require('./jsonController');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
const app = express();

dotenv.config();
// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  })


// Import multer like the other dependencies
const multer = require('multer')
// Set multer file storage folder
const upload = multer({ dest: 'uploads/' })

// Set port
const port = 3001;
// Create schema
const DocumentoSchema = mongoose.model('Documento', {
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number
});
const GastoSchema = mongoose.model('Gasto', {
  tarjeta: String,
  Cargo: {
    fecha: String,
    descripcion: String,
    cargo: Number,
    abono: Number,
  }
});
// Register middlewares
app.use(bodyParser.urlencoded({ extended: false }))

// Home route
app.get('/', (req, res) => {
  const filter = {};
  DocumentoSchema.find(filter).then((all) => {
    res.send(all);
  })
})
app.get('/gastos', (req, res) => {
  const filter = {};
  GastoSchema.find(filter).then((all) => {
    res.send(all);
  })
})
// Image processing route
app.post('/upload', upload.single('image'), (req, res) => {

  const documento = new DocumentoSchema(req.file);
  const documentoJSON = leeExcel(req.file.path);
  const gastoTemp = {};
  for (let i=3; i<documentoJSON.length; i++) {
    if (documentoJSON[i][1] != null || documentoJSON[i][1] != undefined || documentoJSON[i][1] != ""){
    const gasto = new GastoSchema();
    gasto.tarjeta = documentoJSON [0][0];
    gastoTemp.fecha = documentoJSON[i][0];
    gastoTemp.descripcion = documentoJSON[i][1];
    gastoTemp.cargo = documentoJSON[i][2];
    gastoTemp.abono = documentoJSON[i][3];
    gasto.Cargo = {...gastoTemp};
    console.log("gasto:",gasto);
    gasto.save().then(() => console.log('Gasto guardado'));
    }
  }
  documento.save().then(() => console.log('Documento guardado'));
  res.send('Image uploaded successfully');
})


// Start listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
