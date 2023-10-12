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
  const psw = req.query.psw;
  const filter = {};
  if (psw == process.env.PSW) {
    res.send('Bienvenido al sistema de carga de estados de cuenta');
    DocumentoSchema.find(filter).then((all) => {
      res.send(all);
    })
  } else {
    res.send('Contraseña incorrecta');
  }
})
app.get('/gastos', (req, res) => {
  const filter = {};
  const psw = req.query.psw;
  if (psw == process.env.PSW) {
    GastoSchema.find(filter).then((all) => {
      res.send(all);
    })
  } else {
    res.send('Contraseña incorrecta');
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  const psw = req.query.psw;
  const tarjeta = req.query.TARJETA;
  if (psw != process.env.PSW) {
    res.send('Contraseña incorrecta');
  } else {
    const documento = new DocumentoSchema(req.file);
    const documentoJSON = leeExcel(req.file.path);
    const gastoTemp = {};

    console.log("tarjeta:", tarjeta);
    if (tarjeta == null || tarjeta == undefined || tarjeta == "") {
      res.send('No se ha especificado la tarjeta');
    }
    else {
      if (tarjeta == "BBVA") {
        for (let i = 3; i < documentoJSON.length; i++) {
          if (documentoJSON[i][1] != null || documentoJSON[i][1] != undefined || documentoJSON[i][1] != "") {
            const gasto = new GastoSchema();
            gasto.tarjeta = documentoJSON[0][0];
            gastoTemp.fecha = documentoJSON[i][0];
            gastoTemp.descripcion = documentoJSON[i][1];
            gastoTemp.cargo = documentoJSON[i][2];
            gastoTemp.abono = documentoJSON[i][3];
            gasto.Cargo = { ...gastoTemp };
            gasto.save().then(() => console.log('Gasto guardado'));
          }
        }
      }
      if (tarjeta == "BBVA CREDITO") {
        //console.log(documentoJSON);
        for (let i = 3; i < documentoJSON.length; i++) {
          //console.log(documentoJSON[i][1]);
          if (documentoJSON[i][1] != null || documentoJSON[i][1] != undefined || documentoJSON[i][1] != "" || documentoJSON[i][1] != "DESCRIPCIÓN") {
            console.log(documentoJSON[i][1]);
            const gasto = new GastoSchema();
            gasto.tarjeta = documentoJSON[0][0];
            gastoTemp.fecha = documentoJSON[i][0];
            gastoTemp.descripcion = documentoJSON[i][1];
            gastoTemp.cargo = documentoJSON[i][2];
            gastoTemp.abono = documentoJSON[i][3];
            gasto.Cargo = { ...gastoTemp };
            gasto.save().then(() => console.log('Gasto guardado'));
          }
        }
      }
      if (tarjeta == "AMEX") {
        for (let i = 17; i < documentoJSON.length; i++) {
          if (documentoJSON[i][1] != null || documentoJSON[i][1] != undefined || documentoJSON[i][1] != "" || documentoJSON[i][1] != "Fecha de Compra") {
            const gasto = new GastoSchema();
            gasto.tarjeta = documentoJSON[0][2];
            gastoTemp.fecha = documentoJSON[i][0];
            gastoTemp.descripcion = documentoJSON[i][2];
            let esCargo = documentoJSON[i][4];
            esCargo = esCargo.replace("$", "");
            esCargo = esCargo.replace(",", "");
            console.log(esCargo);
            if (esCargo > 0) {
              gastoTemp.cargo = esCargo;
              gastoTemp.abono = 0;
            } else {
              gastoTemp.cargo = 0;
              gastoTemp.abono = esCargo;
            }
            gasto.Cargo = { ...gastoTemp };
            gasto.save().then(() => console.log('Gasto guardado'));
          }
        }
      }
    }

    documento.save().then(() => console.log('Documento guardado'));
    res.send('Estado de cuenta dado de alta de manera correcta de la tarjeta:', tarjeta);
  }
})


// Start listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
