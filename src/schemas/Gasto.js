const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const GastoSchema = new Schema({
    tarjeta: String,
    Cargo: {
        fecha: String,
        descripcion: String,
        cargo: Number,
        abono: Number,
    }
});
module.exports = mongoose.model('Gasto', GastoSchema);