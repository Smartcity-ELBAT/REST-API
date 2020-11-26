const Router = require("express-promise-router");
const router = new Router;
const Controller = require("../controller/person");
const IdentificationJWTMiddelWare = require("../middleware/Identification");
const AuthorizationMiddelWare = require("../middleware/Authorization");

router.get("/one/:username", Controller.getUser);
router.get("/all", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, Controller.getAllUsers);
router.post("/", IdentificationJWTMiddelWare.identification, Controller.addUser);
router.patch("/", IdentificationJWTMiddelWare.identification, Controller.updateUser);
router.patch("/updatePassword", IdentificationJWTMiddelWare.identification, Controller.updatePassword);
router.patch("/addToEstablishment", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, Controller.linkUserToEstablishment);

module.exports = router;