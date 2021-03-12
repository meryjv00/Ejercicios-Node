var mongoose = require("mongoose");

// module.exports = mongoose.model('usuarios', {
//     id: Number,
//     nombre: String,
//     edad: Number
// });

var userSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    correo: { type: String },
    pass: { type: String },
    nombre: { type: String },
    tfno: { type: String },
    edad: { type: Number },
    activado: { type: Number }

}, { collection: 'ejemplo.usuarios' });

var User = mongoose.model('user', userSchema);

module.exports = User;