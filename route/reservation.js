const Router = require("express-promise-router");
const router = new Router;
const ReservationController = require("../controller/reservation");

router.get("/client/:idClient", ReservationController.getClientReservations);
router.get("/day/:day", ReservationController.getDayReservations);
router.post("/", ReservationController.addReservation);

module.exports = router;