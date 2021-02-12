var express = require('express');
var body_parser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

app.set("view engine", "jade");
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(cookieParser());

var session = require('express-session');
app.use(session({
    secret: '123456789',
    resave: false,
    saveUninitialized: true
}))

//------------------------------------
//**********************************/
app.get("/", function(req, res) {
    res.render("index");
});
//**********************************/
app.post("/jugar", function(req, res) {
    //Se guarda en sesión número de la tabla e intentos
    req.session.tabla = req.body.tabla;
    req.session.intentos = 5;
    console.log(req.session);
    //Devolvemos el número de la tabla y los intentos
    res.render("tabla", { tabla: req.session.tabla, intentos: req.session.intentos });
});
//**********************************/
app.post("/validarTabla", function(req, res) {
    //Variables
    var intentos = req.session.intentos;
    var respuestas = req.body.rdo;
    var colores = [];
    var fallo = false;
    var ganar = false;
    //Recorremos el vector respuestas para ver cuales ha fallado/acertado
    for (i = 0; i < respuestas.length; i++) {
        if (req.session.tabla * (i + 1) == respuestas[i]) {
            colores[i] = 'green';
        } else {
            colores[i] = 'red';
            fallo = true;
        }
    }
    //Ha fallado alguno
    if (fallo) {
        intentosF = intentos - 1;
        req.session.intentos = intentosF;
    } else { //Has ganado
        ganar = true;
    }
    //Se acabaron los intentos
    if (intentosF == 0) {
        res.render("fracaso", { tabla: req.session.tabla });

    } else { //Quedan intentos
        res.render("tabla", { tabla: req.session.tabla, intentos: req.session.intentos, ganar: ganar, respuestas: respuestas, colores: colores });
    }
});
//**********************************/
app.post("/meRindo", function(req, res) {
    if (req.session.tabla) {
        res.render("fracaso", { tabla: req.session.tabla });
    }
});
//**********************************/
app.listen(8090);