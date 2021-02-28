var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var configDB = require("../config/db.config");

app.use(bodyParser.json());

var pool = mysql.createPool(configDB);

//-----------------------------------------------------
checkDuplicateUsernameOrEmail = (req, res, next) => {
    pool.query('SELECT * FROM personas WHERE dni = ?', req.body.dni, (error, result) => {
        if (error) throw error;
        var resultado = result;
        if (resultado.length > 0) {
            res.status(500).send({ status: 500, message: 'Datos ya existentes' });
        } else {
            next();
        }
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;