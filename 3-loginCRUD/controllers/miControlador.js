var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
//var bcrypt = require("bcryptjs");
var bcrypt = require("bcrypt");
var app = express();

var config = {
    host: 'localhost',
    user: 'Maria',
    password: 'Chubaca2020',
    database: 'node_ejer',
    port: 3306
};

var pool = mysql.createPool(config);
module.exports = pool;
exports.pool = pool;

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
    //Obtenemos los datos de la persona
    pool.query('SELECT * FROM personas WHERE Correo = ?', [req.body.correo], (error, result) => {
        if (error) throw error;
        //res.status(200).send(result);
        var persona = result;
        if (persona.length > 0) {
            //Comprobamos si las contraseñas coinciden
            var coinciden = bcrypt.compareSync(req.body.pass, persona[0].contra);
            if (coinciden) {
                //Cuenta activada
                if (persona[0].activado == 1) {
                    //Obtenemos su rol
                    pool.query('SELECT idRol FROM personarol WHERE dniPersona = ?', [persona[0].dni], (error, result) => {
                        var rol = result;
                        if (rol.length > 0) {
                            //Rol administrador
                            if (rol[0].idRol == 1) {
                                //Obtener todas las personas
                                pool.query('SELECT * FROM personas', [], (error, result) => {
                                    var personas = result;
                                    if (personas.length > 0) {
                                        //Guarda en sesión persona logeada y personas
                                        req.session.persona = persona[0];
                                        req.session.personas = personas;
                                        res.render("admin", { persona: persona[0], personas: personas });
                                    } else {
                                        res.render('index', { mensaje: 'No se ha podido iniciar sesión' });
                                    }
                                });

                            } else { //Rol usuario
                                res.render("usuario", { persona: persona[0] });
                            }
                        } else {
                            res.render('index', { mensaje: 'No se ha podido iniciar sesión' });
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
        //Editar persona
        pool.query('UPDATE personas SET correo = ?, nombre = ?, tfno = ?, edad = ? WHERE dni = ?', [req.body.correo, req.body.nombre, req.body.tfno, req.body.edad, req.body.dni], (error, result) => {
            if (error) throw error;
            return;
        });
        //Actualizamos los datos de la persona seleccionada en la lista de personas guardadas en sesion
        req.session.personas.forEach((persona, index) => {
            if (persona.dni == req.body.dni) {
                persona.correo = req.body.correo;
                persona.nombre = req.body.nombre;
                persona.tfno = req.body.tfno;
                persona.edad = req.body.edad;
            }
        });

    } else if (req.body.accion == 'Eliminar') {
        //Eliminamos persona
        pool.query('DELETE FROM personas WHERE dni = ?', [req.body.dni], (error, result) => {
            if (error) throw error;
            return;
        });
        //Borramos la persona seleccionada de la lista de personas guardadas en sesion
        req.session.personas.forEach((persona, index) => {
            if (persona.dni == req.body.dni) {
                req.session.personas.splice(index, 1);
            }
        });

    } else if (req.body.accion == 'Activar') {
        //Activar cuenta
        pool.query('UPDATE personas SET activado = 1 WHERE dni = ?', [req.body.dni], (error, result) => {
            if (error) throw error;
            return;
        });
        //Actualizamos que se ha activado dicha cuenta
        req.session.personas.forEach((persona, index) => {
            if (persona.dni == req.body.dni) {
                persona.activado = 1;
            }
        });

    } else {
        //Desactivar cuenta
        pool.query('UPDATE personas SET activado = 0 WHERE dni = ?', [req.body.dni], (error, result) => {
            if (error) throw error;
            return;
        });
        //Actualizamos que se ha desactivado dicha cuenta
        req.session.personas.forEach((persona, index) => {
            if (persona.dni == req.body.dni) {
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
    //Encriptar contraseña
    var pass = bcrypt.hashSync(req.body.pass, 10);

    //Se añade nueva persona
    pool.query('INSERT INTO personas VALUES(?,?,?,?,?,?,0)', [req.body.dni, req.body.correo, pass, req.body.nombre, req.body.tfno, req.body.edad], (error, result) => {
        if (error) throw error;
        //Se obtiene el n rol
        if (req.body.rol == 'Admin') {
            rol = 1;
        } else {
            rol = 2;
        }
        //Se añade el rol
        pool.query('INSERT INTO personarol VALUES(?,?)', [rol, req.body.dni], (error, result) => {
            if (error) throw error;
            //Se obtienen las personas con la nueva añadida
            pool.query('SELECT * FROM personas', [], (error, result) => {
                if (error) throw error;
                var personas = result;
                if (personas.length > 0) {
                    req.session.personas = personas;
                    res.render("admin", { persona: req.session.persona, personas: req.session.personas });
                } else {
                    res.render('addPersona', { mensaje: 'Ha ocurrido un error' });
                }
            });
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