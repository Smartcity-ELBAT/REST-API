const router = require("express").Router();

const UserRouter = require("./user");
const EstablishmentRouter = require("./establishment");
const PersonRouter = require("./person");
const TableRouter = require("./table");
const ReservationRouter = require("./reservation");

router.use("/user", UserRouter);
router.use("/establishment", EstablishmentRouter);
router.use("/person", PersonRouter);
router.use("/table", TableRouter);
router.use("/reservation", ReservationRouter);

module.exports = router;