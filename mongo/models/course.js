//* Colecciones -> Tablas
//* Documentos -> Filas
const mongoose = require('mongoose');

const courseShema = new mongoose.Schema({
    title: String,
    views: Number,
});

module.exports = mongoose.model('Course', courseShema);