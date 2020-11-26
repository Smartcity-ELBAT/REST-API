const EstablishmentController = require("../controller/establishment");
const IdentificationJWTMiddelWare = require("../middleware/Identification");
const AuthorizationMiddelWare = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;

router.get("/:id",IdentificationJWTMiddelWare.identification, EstablishmentController.getEstablishment);
router.get("/", IdentificationJWTMiddelWare.identification, EstablishmentController.getAllEstablishments);
router.post("/", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, EstablishmentController.addEstablishment);
router.patch("/", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, EstablishmentController.patchEstablishment);
router.delete("/", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, EstablishmentController.deleteEstablishment);

module.exports = router;