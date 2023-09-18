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
/*
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
const model = mongoose.model('People', peopleSchema);

export const schema = model.schema;
export default model;
  module.exports = {
    DocumentoSchema,
    GastoSchema
    }
    module.exports = mongoose.model('Books', bookSchema)
    */