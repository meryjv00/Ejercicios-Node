const config = require("../config/auth.config");
var configDB = require("../config/db.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var pool = mysql.createPool(configDB);

//Registro
exports.signup = (req, res) => {
    //Encriptar contraseña
    var pass = bcrypt.hashSync(req.body.pass, 10);

    pool.query('INSERT INTO personas VALUES(?,?,?,?,?,?,0)', [req.body.dni, req.body.correo, pass, req.body.nombre, req.body.tfno, req.body.edad], (error, result) => {
        if (error) res.status(500).send({ status: 500, message: 'Error al realizar registro' });
        //En caso de que no ha habido error al insertar la persona, se prodede a insertar el rol
        if (req.body.rol == 'Admin') {
            rol = 1;
        } else {
            rol = 2;
        }
        //Se añade el rol
        pool.query('INSERT INTO personarol VALUES(?,?)', [rol, req.body.dni], (error, result) => {
            if (error) res.status(500).send({ status: 500, message: 'Error al realizar registro' });
            res.status(201).send({ status: 201, message: 'Registro realizado con éxito' });
        });
    });
};


//Login
exports.signin = (req, res) => {
    pool.query('SELECT * FROM personas WHERE correo = ?', req.body.correo, (error, result) => {
        if (error) res.status(500).send({ status: 500, message: 'Error en la consulta' });
        var personas = result;
        if (personas.length > 0) {
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                personas[0].contra
            );
            if (!passwordIsValid) {
                return res.status(404).send({
                    status: 404,
                    message: "Login incorrecto, revise las credenciales"
                });
            } else {
                //Cuenta activada
                if (personas[0].activado == 1) {
                    //Obtenemos el rol 
                    pool.query('SELECT idRol FROM personarol WHERE dniPersona = ?', [personas[0].dni], (error, result) => {
                        var roles = result;
                        if (roles.length > 0) {
                            //Genera token 
                            var token = jwt.sign({ id: personas[0].id }, config.secret, {
                                expiresIn: 86400 // 24 horas
                            });
                            res.status(200).send({ status: 200, accessToken: token, message: { 'persona': personas[0], 'idRol': roles[0].idRol } });

                        } else {
                            return res.status(404).send({ status: 404, message: "No se ha podido iniciar sesión" });
                        }
                    });

                } else { //Cuenta desactivada
                    return res.status(404).send({ status: 404, message: "Cuenta desactivada, contacte con un administrador" });
                }
            }
        } else {
            return res.status(404).send({ status: 404, message: "Login incorrecto, revise las credenciales" });
        }
    });
};