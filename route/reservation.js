const Router = require("express-promise-router");
const router = new Router;
const ReservationController = require("../controller/reservation");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");

router.get("/client/:idClient", IdentificationJWTMiddleWare.identification, ReservationController.getClientReservations);
router.get("/:establishmentId/:dateTimeReserved", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, ReservationController.getDayReservations);
router.post("/", IdentificationJWTMiddleWare.identification, ReservationController.addReservation);
router.patch("/arrivingTime", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, ReservationController.updateArrivingTime);
router.patch("/exitTime", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, ReservationController.updateExitTime);
router.patch("/cancel", IdentificationJWTMiddleWare.identification, ReservationController.cancelReservation);

module.exports = router;