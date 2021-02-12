var express = require('express');
var body_parser = require('body-parser');

var app = express();

app.set("view engine", "jade");
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

//------------------------------------
//**********************************/
app.get("/", function(req, res) {
    res.render("index");
});
//**********************************/
app.post("/calcular", function(req, res) {
    console.log(req.body);
    var n1 = parseInt(req.body.n1);
    var n2 = parseInt(req.body.n2);
    var op = req.body.operacion;
    var rdo;
    if (op == '+') {
        rdo = n1 + n2;
    } else if (op == '-') {
        rdo = n1 - n2;
    } else if (op == '*') {
        rdo = n1 * n2;
    } else {
        rdo = n1 / n2;
    }
    res.render("index", { n1: n1, n2: n2, rdo: rdo });
});
//**********************************/
app.listen(8090);