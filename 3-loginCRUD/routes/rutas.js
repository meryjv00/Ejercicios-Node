// Cargamos el módulo de express para poder crear rutas
var express = require('express');

// Cargamos el controlador para poder referenciar a los métodos del mismo.
var miController = require('../controllers/miControlador.js');

// Llamamos al router que permitirá definir rutas.
var api = express.Router();

//************************** Rutas ****************************
api.get('/', miController.indice);

// Ruta get página principal
api.get('/indice', miController.indice);

//Validación formulario LOGIN
api.post("/validar", miController.validar);

//Admininistrar personas
api.post("/adminPersonas", miController.adminPersonas);

// Ruta add nueva persona
api.post('/addNuevaPersona', miController.nuevaPersona);
// Ruta add nueva persona
api.get('/addNuevaPersona', miController.nuevaPersona);

// Cerrar sesión
api.post('/cerrarSesion', miController.cerrarSesion);

//Añadir persona
api.post('/addPersona', miController.addPersona);

// Ir crud
api.post('/irCRUD', miController.irCRUD);

//*************************************************************
// Exportamos la configuración
module.exports = api;