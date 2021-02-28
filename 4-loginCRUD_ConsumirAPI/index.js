// express & bodyparser
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
//variables config
var config = require("./config/auth.config");

//app
var app = express();

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Establecemos el motor de plantillas.
app.set("view engine", "jade");

//Importamos las rutas
var nota_routes = require('./routes/rutas.js');

//Cargamos las rutas, el primer argumento indica un prefijo para la URL. /api
app.use("/", nota_routes);

//Exportamos los métodos de esta clase.
module.exports = app;

app.listen(7070);