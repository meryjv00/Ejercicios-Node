var mongoose = require("mongoose");

// module.exports = mongoose.model('roles', {
//     id: Number,
//     rol: String
// });

var rolesSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    rol: { type: String }
}, { collection: 'ejemplo.roles' });


var Rol = mongoose.model('rol', rolesSchema);

module.exports = Rol;