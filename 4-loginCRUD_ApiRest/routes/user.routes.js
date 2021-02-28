const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //--Get personas
    app.get(
        '/api/getPersonas', [authJwt.verifyToken], [authJwt.isAdmin],
        controller.getPersonas
    );

    //--Editar persona
    app.put(
        '/api/updatePersona', [authJwt.verifyToken], [authJwt.isAdmin],
        controller.updatePersona
    );

    //--Eliminar persona
    app.delete(
        '/api/deletePersona', [authJwt.verifyToken], [authJwt.isAdmin],
        controller.deletePersona
    );

    //--Activar persona
    app.put(
        '/api/enablePersona', [authJwt.verifyToken], [authJwt.isAdmin],
        controller.enablePersona
    );

    //--Desactivar persona
    app.put(
        '/api/disablePersona', [authJwt.verifyToken], [authJwt.isAdmin],
        controller.disablePersona
    );


};