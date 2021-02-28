//express & bodyparser & cors
var express = require('express');
var bodyParser = require('body-parser');
var cors = require("cors");

//app
var app = express();

//Cors
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));


//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//motor plantillas -> jade
app.set("view engine", "jade");

//Importamos las rutas
require('./routes/user.routes.js')(app);
require('./routes/auth.routes.js')(app);

//Exportamos los métodos de esta clase.
module.exports = app;

//Ruta de bienvenida
app.get("/", (req, res) => {
    res.json({ message: "API LOGIN CRUD - BIENVENIDO" });
});

app.listen(6060);