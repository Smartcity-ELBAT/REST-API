const Router = require("express-promise-router");
const router = new Router;
const TableController = require("../controller/table");

router.get("/:idEstablishment", TableController.getAllTables);
router.get("/:idEstablishment/:idTable", TableController.getTable);
router.post("/", TableController.addTable);
router.patch("/", TableController.updateTable);
router.delete("/", TableController.deleteTable);

module.exports = router;