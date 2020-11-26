const Router = require("express-promise-router");
const router = new Router;
const Controller = require("../controller/person");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");

router.get("/one/username/:username", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.getUser);
router.get("/one/phoneNumber/:phoneNumber", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, Controller.getUserByPhoneNumber);
router.get("/all", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.getAllUsers);
router.post("/", IdentificationJWTMiddleWare.identification, Controller.addUser);
router.patch("/", IdentificationJWTMiddleWare.identification, Controller.updateUser);
router.patch("/updatePassword", IdentificationJWTMiddleWare.identification, Controller.updatePassword);
router.patch("/addToEstablishment", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.linkUserToEstablishment);

module.exports = router;