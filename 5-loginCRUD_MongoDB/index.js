// express & bodyparser
var express = require('express');
var bodyParser = require('body-parser');

// Importamos las rutas
var nota_routes = require('./routes/rutas.js');

var app = express();
var session = require('express-session');
app.use(session({
    secret: '123456789',
    resave: false,
    saveUninitialized: true
}));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ejemplo");

// body-parser --> necesario para recuperar los datos de los formularios.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Establecemos el motor de plantillas.
app.set("view engine", "jade");

// Cargamos las rutas, el primer argumento indica un prefijo para la URL. /api
app.use("/", nota_routes);

//Exportamos los métodos de esta clase.
module.exports = app;



app.listen(8090);