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

//Get personas
exports.getPersonas = (req, res) => {
    pool.query('SELECT * FROM personas', [], (error, result) => {
        if (error) res.status(500).send({ status: 500, message: 'Error en la consulta' });
        var personas = result;
        if (personas.length > 0) {
            res.status(200).send({ status: 200, message: personas });
        } else {
            return res.status(404).send({ status: 404, message: "Personas no encontradas" });
        }
    });
}

//Editar persona
exports.updatePersona = (req, res) => {
    pool.query('UPDATE personas SET correo = ?, nombre = ?, tfno = ?, edad = ? WHERE dni = ?', [req.body.correo, req.body.nombre, req.body.tfno, req.body.edad, req.body.dni], (error, result) => {
        if (error) res.status(500).send({ status: 500, message: 'Error en la consulta' }); //throw error;
        res.status(200).send({ status: 200, message: 'Actualizado con éxito' });
    });
}

//Borrar persona
exports.deletePersona = (req, res) => {
    pool.query('DELETE FROM personas WHERE dni = ?', [req.body.dni], (error, result) => {
        if (error) res.status(500).send({ status: 500, message: 'Error en la consulta' });
        res.status(200).send({ status: 200, message: 'Borrado con éxito' });
    });
}

//Activar persona
exports.enablePersona = (req, res) => {
    pool.query('UPDATE personas SET activado = 1 WHERE dni = ?', [req.body.dni], (error, result) => {
        if (error) res.status(500).send({ status: 500, message: 'Error en la consulta' });
        res.status(200).send({ status: 200, message: 'Actualizado con éxito' });
    });
}

//Desactivar persona
exports.disablePersona = (req, res) => {
    pool.query('UPDATE personas SET activado = 0 WHERE dni = ?', [req.body.dni], (error, result) => {
        if (error) res.status(500).send({ status: 500, message: 'Error en la consulta' });
        res.status(200).send({ status: 200, message: 'Actualizado con éxito' });
    });
}