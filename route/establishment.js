const Router = require("express-promise-router");
const router = new Router;
const EstablishmentController = require("../controller/establishment");

router.get("/:id", EstablishmentController.getEstablishment);
router.get("/", EstablishmentController.getAllEstablishments);
router.post("/", EstablishmentController.addEstablishment);

module.exports = router;