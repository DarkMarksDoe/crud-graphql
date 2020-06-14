//* Colecciones -> Tablas
//* Documentos -> Filas
const mongoose = require('mongoose');

const courseShema = new mongoose.Schema({
    title: String,
    views: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Course', courseShema);