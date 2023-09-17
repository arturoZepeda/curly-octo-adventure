import { Schema } from "mongoose";

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

  module.exports = {
    DocumentoSchema,
    GastoSchema
    }

