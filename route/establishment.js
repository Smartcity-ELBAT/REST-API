const EstablishmentController = require("../controller/establishment");
const Router = require("express-promise-router");
const router = new Router;

router.patch("/", EstablishmentController.patch);
router.delete("/", EstablishmentController.delete);

module.exports = router;