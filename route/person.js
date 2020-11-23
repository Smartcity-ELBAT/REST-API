const Router = require("express-promise-router");
const router = new Router;
const Controller = require("../controller/person");

router.get("/:username", Controller.getUser);
router.get("/all", Controller.getAllUsers);
router.post("/", Controller.addUser);
router.patch("/", Controller.updateUser);
router.patch("/updatePassword", Controller.updatePassword);
router.patch("/addToEstablishment", Controller.linkUserToEstablishment);

module.exports = router;