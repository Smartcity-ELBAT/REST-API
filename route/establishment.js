const EstablishmentController = require("../controller/establishment");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;

router.get("/:id",IdentificationJWTMiddleWare.identification, EstablishmentController.getEstablishment);
router.get("/", IdentificationJWTMiddleWare.identification, EstablishmentController.getAllEstablishments);
router.post("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, EstablishmentController.addEstablishment);
router.patch("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, EstablishmentController.patchEstablishment);
router.delete("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, EstablishmentController.deleteEstablishment);

module.exports = router;