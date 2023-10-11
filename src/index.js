const { leeExcel } = require('./controller/excelController');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
let DocumentoSchema = require('./schemas/Documento');
let GastoSchema = require('./schemas/Gasto');
const app = express();
// Load env variables
dotenv.config();
// Connect to DB
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  })
// Import multer like the other dependencies
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const port = 3001;

// Register middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Import schemas

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
});

app.post('/upload', upload.single('file'), (req, res) => {
  const tarjeta = req.query.TARJETA;
  const documento = new DocumentoSchema(req.file);
  const documentoJSON = leeExcel(req.file.path);
  const gastoTemp = {};
  
  console.log("tarjeta:",tarjeta);
  if( tarjeta == null || tarjeta == undefined || tarjeta == ""){
    res.send('No se ha especificado la tarjeta');
  }
  else{
    if (tarjeta == "BBVA"){
      for (let i=3; i<documentoJSON.length; i++) {
        if (documentoJSON[i][1] != null || documentoJSON[i][1] != undefined || documentoJSON[i][1] != ""){
        const gasto = new GastoSchema();
        gasto.tarjeta = documentoJSON [0][0];
        gastoTemp.fecha = documentoJSON[i][0];
        gastoTemp.descripcion = documentoJSON[i][1];
        gastoTemp.cargo = documentoJSON[i][2];
        gastoTemp.abono = documentoJSON[i][3];
        gasto.Cargo = {...gastoTemp};
        gasto.save().then(() => console.log('Gasto guardado'));
        }
      }
    }
    if(tarjeta=="BBVA CREDITO"){
      //console.log(documentoJSON);
      for (let i=3; i<documentoJSON.length; i++) {
        //console.log(documentoJSON[i][1]);
        if (documentoJSON[i][1] != null || documentoJSON[i][1] != undefined || documentoJSON[i][1] != ""|| documentoJSON[i][1] != "DESCRIPCIÓN"){
          console.log(documentoJSON[i][1]);
          const gasto = new GastoSchema();
          gasto.tarjeta = documentoJSON [0][0];
          gastoTemp.fecha = documentoJSON[i][0];
          gastoTemp.descripcion = documentoJSON[i][1];
          gastoTemp.cargo = documentoJSON[i][2];
          gastoTemp.abono = documentoJSON[i][3];
          gasto.Cargo = {...gastoTemp};
          gasto.save().then(() => console.log('Gasto guardado'));
        }
      }
    }
  }
  
  documento.save().then(() => console.log('Documento guardado'));
  res.send('Estado de cuenta dado de alta de manera correcta de la tarjeta:');
})


// Start listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
