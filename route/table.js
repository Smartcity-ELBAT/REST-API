const Router = require("express-promise-router");
const router = new Router;
const TableController = require("../controller/table");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");

router.get("/:idEstablishment", IdentificationJWTMiddleWare.identification, TableController.getAllTables);
router.get("/:idEstablishment/:idTable", IdentificationJWTMiddleWare.identification, TableController.getTable); // TODO vérifier si on l'utilise
router.post("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, TableController.addTable);
router.patch("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, TableController.updateTable);
router.delete("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, TableController.deleteTable);

module.exports = router;