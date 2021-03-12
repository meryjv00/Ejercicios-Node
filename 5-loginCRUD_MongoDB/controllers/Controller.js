var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require("bcrypt");
var app = express();
//Modelos
var usuarios = require('../models/usuario');
var asignacionRoles = require('../models/asignacionRoles');

app.use(bodyParser.json());

//************************************************************************************* */
// Página principal
function indice(req, res) {
    res.render("index");
}
// Página nueva persona
function nuevaPersona(req, res) {
    res.render("addPersona");
}
// Cerrar sesión
function cerrarSesion(req, res) {
    req.session.destroy();
    res.render("index");
}

//Ir CRUD
function irCRUD(req, res) {
    res.render("admin", { 'persona': req.session.persona, personas: req.session.personas });
}

/**
 * LOGIN
 * @param {*} req 
 * @param {*} res 
 */
function validar(req, res) {

    usuarios.find({ correo: req.body.correo }, function (err, usuario) {
        if (err) throw err;
        if (usuario.length > 0) {
            // Comprobar pass
            var coinciden = bcrypt.compareSync(req.body.pass, usuario[0].pass);
            if (coinciden) {
                // Comprobar estado de la cuenta
                if (usuario[0].activado == 1) {
                    // Comprobar rol !! 
                    asignacionRoles.find({ idU: usuario[0].id }, function (err, rol) {
                        if (err) throw err;
                        if (rol.length > 0) {
                            // Es administrador
                            if (rol[0].idR == 2) {
                                // Obtener todos los usuarios
                                usuarios.find(
                                    function (err, personas) {
                                        if (err) throw err;
                                        if (personas.length > 0) {
                                            //Guarda en sesión persona logeada y personas
                                            req.session.persona = usuario[0];
                                            req.session.personas = personas;
                                            res.render("admin", { persona: usuario[0], personas: personas });
                                        }
                                    }
                                );
                            } else { //Es usuario
                                res.render("usuario", { persona: usuario[0] });
                            }
                        }
                    });
                } else {
                    res.render('index', { mensaje: 'Cuenta desactivada, contacte con un administrador' });
                }
            } else {
                res.render('index', { mensaje: 'Login incorrecto, revise las credenciales' });
            }
        } else {
            res.render('index', { mensaje: 'Login incorrecto, revise las credenciales' });
        }
    });
}


/**
 * Administrar personas CRUD (editar,eliminar)
 * @param {*} req 
 * @param {*} res 
 */
function adminPersonas(req, res) {
    if (req.body.accion == 'Editar') {
        // Editar persona
        usuarios.updateOne({ id: req.body.id }, { $set: { correo: req.body.correo, nombre: req.body.nombre, tfno: req.body.tfno, edad: req.body.edad } }, function (err, res) {
            if (err) throw err;
            console.log("Usuario actualizado");
        });

        // Actualizamos los datos de la persona seleccionada en la lista de personas guardadas en sesion
        req.session.personas.forEach((persona, index) => {
            if (persona.id == req.body.id) {
                persona.correo = req.body.correo;
                persona.nombre = req.body.nombre;
                persona.tfno = req.body.tfno;
                persona.edad = req.body.edad;
            }
        });

    } else if (req.body.accion == 'Eliminar') {
        // Eliminamos persona
        usuarios.deleteOne({ id: req.body.id }, function (err, personas) {
            if (err) throw err;
            console.log("Usuario borrado");
        });

        // Borramos la persona seleccionada de la lista de personas guardadas en sesion
        req.session.personas.forEach((persona, index) => {
            if (persona.id == req.body.id) {
                req.session.personas.splice(index, 1);
            }
        });

    } else if (req.body.accion == 'Activar') {
        // Activar cuenta
        usuarios.updateOne({ id: req.body.id }, { $set: { activado: '1' } }, function (err, res) {
            if (err) throw err;
            console.log("Usuario activado");
        });
        // Actualizamos que se ha activado dicha cuenta
        req.session.personas.forEach((persona, index) => {
            if (persona.id == req.body.id) {
                persona.activado = 1;
            }
        });

    } else {
        // Desactivar cuenta
        usuarios.updateOne({ id: req.body.id }, { $set: { activado: '0' } }, function (err, res) {
            if (err) throw err;
            console.log("Usuario desactivado");
        });
        // Actualizamos que se ha desactivado dicha cuenta
        req.session.personas.forEach((persona, index) => {
            if (persona.id == req.body.id) {
                persona.activado = 0;
            }
        });

    }

    res.render("admin", { persona: req.session.persona, personas: req.session.personas });
}

/**
 * Añade nueva persona
 * @param {*} req 
 * @param {*} res 
 */
function addPersona(req, res) {
    // Encriptar contraseña
    var pass = bcrypt.hashSync(req.body.pass, 10);
    var ult_id = req.session.personas[req.session.personas.length - 1].id + 1;
    // Insertar usuario
    usuarios.insertMany({ id: ult_id, correo: req.body.correo, pass: pass, nombre: req.body.nombre, tfno: req.body.tfno, edad: req.body.edad, activado: '0' }, function (error, persona) {
        if (error) throw error;
        // Obtener n rol
        if (req.body.rol == 'Admin') {
            rol = 2;
        } else {
            rol = 1;
        }
        // Insertar rol
        asignacionRoles.insertMany({ idU: ult_id, idR: rol }, function (error, rol) {
            if (error) throw error;
            // Obtener todos los usuarios
            usuarios.find(
                function (err, personas) {
                    if (err) throw err;
                    if (personas.length > 0) {
                        req.session.personas = personas;
                        res.render("admin", { persona: req.session.persona, personas: req.session.personas });
                    } else {
                        res.render('addPersona', { mensaje: 'Ha ocurrido un error' });
                    }
                }
            );
        });
    });

}

// Exportamos las funciones en un objeto json para poder usarlas en otros fuera de este fichero
module.exports = {
    indice,
    nuevaPersona,
    cerrarSesion,
    validar,
    adminPersonas,
    addPersona,
    irCRUD
};