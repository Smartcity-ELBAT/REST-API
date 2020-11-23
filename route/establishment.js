const EstablishmentController = require("../controller/establishment");
const Router = require("express-promise-router");
const router = new Router;

router.get("/:id", EstablishmentController.getEstablishment);
router.get("/", EstablishmentController.getAllEstablishments);
router.post("/", EstablishmentController.addEstablishment);
router.patch("/", EstablishmentController.patchEstablishment);
router.delete("/", EstablishmentController.deleteEstablishment);

module.exports = router;