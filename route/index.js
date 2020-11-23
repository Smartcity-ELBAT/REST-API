const router = require("express").Router();
const UserRouter = require("./user");
const EstablishmentRouter = require("./establishment");
const PersonRouter = require("./person");

router.use("/user", UserRouter);
router.use("/establishment", EstablishmentRouter);
router.use("/person", PersonRouter);

module.exports = router;