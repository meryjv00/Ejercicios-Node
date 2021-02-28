var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require("bcryptjs");
var Request = require("request");

var app = express();
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
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://localhost:6060/api/auth/signin",
        "body": JSON.stringify({
            "correo": req.body.correo,
            "password": req.body.pass
        })
    }, (error, response, body) => {
        if (error) {
            res.render("index", { mensaje: JSON.parse(body).message });
            console.log(error);
        }

        recibido = JSON.parse(body);
        if (recibido.status == 404) { //Login incorrecto
            res.render("index", { mensaje: JSON.parse(body).message });

        } else { //Login correcto
            //Rol administrador
            if (recibido.message.idRol == 1) {
                //Obtener todas las personas
                Request.get({
                    "headers": { "content-type": "application/json", "authorization": recibido.accessToken },
                    "url": "http://localhost:6060/api/getPersonas",
                    "body": JSON.stringify({
                        "idRol": recibido.message.idRol
                    }),
                }, (error, response, body) => {
                    if (error) {
                        res.render("index", { mensaje: 'Error al iniciar sesión' });
                        console.log(error);
                    }
                    recibido2 = JSON.parse(body);
                    //Guarda en sesión token, persona logeada, personas, rol
                    req.session.token = recibido.accessToken;
                    req.session.persona = recibido.message.persona;
                    req.session.personas = recibido2.message;
                    req.session.idRol = recibido.message.idRol;
                    res.render("admin", { persona: req.session.persona, personas: req.session.personas });
                });

            } else { //Rol usuario
                res.render("usuario", { persona: recibido.message.persona });
            }
        }

    });

}

/**
 * Administrar personas CRUD (editar,eliminar,activar,desactivar)
 * @param {*} req 
 * @param {*} res 
 */
function adminPersonas(req, res) {
    if (req.body.accion == 'Editar') {
        //Editar persona
        Request.put({
            "headers": { "content-type": "application/json", "authorization": req.session.token },
            "url": "http://localhost:6060/api/updatePersona",
            "body": JSON.stringify({
                "dni": req.body.dni,
                "correo": req.body.correo,
                "nombre": req.body.nombre,
                "tfno": req.body.tfno,
                "edad": req.body.edad,
                "idRol": req.session.idRol
            })
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
        });

        //Actualizamos los datos de la persona seleccionada en la lista de personas guardadas en sesión
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
        Request.delete({
            "headers": { "content-type": "application/json", "authorization": req.session.token },
            "url": "http://localhost:6060/api/deletePersona",
            "body": JSON.stringify({
                "dni": req.body.dni,
                "idRol": req.session.idRol
            })
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
        });

        //Borramos la persona seleccionada de la lista de personas guardadas en sesión
        req.session.personas.forEach((persona, index) => {
            if (persona.dni == req.body.dni) {
                req.session.personas.splice(index, 1);
            }
        });

    } else if (req.body.accion == 'Activar') {
        //Activar cuenta
        Request.put({
            "headers": { "content-type": "application/json", "authorization": req.session.token },
            "url": "http://localhost:6060/api/enablePersona",
            "body": JSON.stringify({
                "dni": req.body.dni,
                "idRol": req.session.idRol
            })
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
        });
        //Actualizamos que se ha activado dicha cuenta
        req.session.personas.forEach((persona, index) => {
            if (persona.dni == req.body.dni) {
                persona.activado = 1;
            }
        });

    } else {
        //Desactivar cuenta
        Request.put({
            "headers": { "content-type": "application/json", "authorization": req.session.token },
            "url": "http://localhost:6060/api/disablePersona",
            "body": JSON.stringify({
                "dni": req.body.dni,
                "idRol": req.session.idRol
            })
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
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
    Request.post({
        "headers": { "content-type": "application/json", "authorization": req.session.token },
        "url": "http://localhost:6060/api/auth/signup",
        "body": JSON.stringify({
            "dni": req.body.dni,
            "correo": req.body.correo,
            "pass": req.body.pass,
            "nombre": req.body.nombre,
            "tfno": req.body.tfno,
            "edad": req.body.edad,
            "rol": req.body.rol,
            "idRol": req.session.idRol
        })
    }, (error, response, body) => {
        if (error) {
            res.render('addPersona', { mensaje: 'No se ha podido añadir la persona' });
            console.log(error);
        }

        //Se añade la nueva persona, para no tener que hacer otra petición get de las personas
        var pass = bcrypt.hashSync(req.body.pass, 10);
        req.session.personas.push({
            dni: req.body.dni,
            correo: req.body.correo,
            contra: pass,
            nombre: req.body.nombre,
            tfno: req.body.tfno,
            edad: req.body.edad,
            activado: 0
        });
        res.render("admin", { persona: req.session.persona, personas: req.session.personas });

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