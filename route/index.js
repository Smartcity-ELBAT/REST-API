const router = require("express").Router();
const EstablishmentRouter = require("./establishment");
const TableRouter = require("./table");
const ReservationRouter = require("./reservation");

router.use("/establishment", EstablishmentRouter);
router.use("/table", TableRouter);
router.use("/reservation", ReservationRouter);

module.exports = router;