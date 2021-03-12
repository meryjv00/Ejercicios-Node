// Cargamos el módulo de express para poder crear rutas
var express = require('express');

// Cargamos el controlador para poder referenciar a los métodos del mismo.
var Controller = require('../controllers/Controller.js');

// Llamamos al router que permitirá definir rutas.
var api = express.Router();

//************************** Rutas ****************************
api.get('/', Controller.indice);

// Ruta get página principal
api.get('/indice', Controller.indice);

//Validación formulario LOGIN
api.post("/validar", Controller.validar);

//Admininistrar personas
api.post("/adminPersonas", Controller.adminPersonas);

// Ruta add nueva persona
api.post('/addNuevaPersona', Controller.nuevaPersona);

// Cerrar sesión
api.post('/cerrarSesion', Controller.cerrarSesion);

//Añadir persona
api.post('/addPersona', Controller.addPersona);

// Ir crud
api.post('/irCRUD', Controller.irCRUD);

//*************************************************************
// Exportamos la configuración
module.exports = api;