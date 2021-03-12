var mongoose = require("mongoose");

// module.exports = mongoose.model('rolusu', {
//     idU: Number,
//     idR: Number
// });

var asignacionRolesSchema = new mongoose.Schema({
    idU: { type: Number, unique: true },
    idR: { type: Number }
}, { collection: 'ejemplo.rolesAsignados' });


var RolUsu = mongoose.model('rolusu', asignacionRolesSchema);

module.exports = RolUsu;