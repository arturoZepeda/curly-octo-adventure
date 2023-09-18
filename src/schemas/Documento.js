const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DocumentoSchema = new Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
});

module.exports = mongoose.model('Doumento', DocumentoSchema);