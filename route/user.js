const Controller = require("../controller/user");
const Router = require("express-promise-router");
const router = new Router;

router.post("/login", Controller.login);

module.exports = router;