const Router = require("express-promise-router");
const router = new Router;
const ReservationController = require("../controller/reservation");

router.get("/client/:idClient", ReservationController.getClientReservations);
router.get("/day/:dateTimeReserved", ReservationController.getDayReservations);
router.post("/", ReservationController.addReservation);
router.patch("/arrivingTime", ReservationController.updateArrivingTime);
router.patch("/exitTime", ReservationController.updateExitTime);
router.patch("/cancel", ReservationController.cancelReservation);
router.patch("/", ReservationController.updateReservation);

module.exports = router;