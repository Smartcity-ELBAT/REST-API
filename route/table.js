const Router = require("express-promise-router");
const router = new Router;
const TableController = require("../controller/table");
const IdentificationJWTMiddelWare = require("../middleware/Identification");
const AuthorizationMiddelWare = require("../middleware/Authorization");

router.get("/:idEstablishment", IdentificationJWTMiddelWare.identification, TableController.getAllTables);
router.get("/:idEstablishment/:idTable", IdentificationJWTMiddelWare.identification, TableController.getTable); // TODO vérifier si on l'utilise
router.post("/", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, TableController.addTable);
router.patch("/", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, TableController.updateTable);
router.delete("/", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeAdmin, TableController.deleteTable);

module.exports = router;