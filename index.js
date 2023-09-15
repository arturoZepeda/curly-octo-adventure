// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
const app = express();

dotenv.config();
// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch(()=>{
        console.log("Couldn't connect to MongoDB");
    })


// Import multer like the other dependencies
const multer  = require('multer')
// Set multer file storage folder
const upload = multer({ dest: 'uploads/' })

// Set port
const port = 3000
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
// Register middlewares
app.use(bodyParser.urlencoded({ extended: false }))

// Home route
app.get('/', (req, res) => {
//const filter = {};
//const all = await User.find(filter);
    const filter = {};
    DocumentoSchema.find(filter).then((all)=>{
        res.send(all);
    })
  })
// Image processing route
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file)
    const documento = new DocumentoSchema(req.file);
    documento.save().then(() => console.log('Documento guardado'));
    res.send('Image uploaded successfully');
  })


// Start listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
