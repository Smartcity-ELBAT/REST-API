const Router = require("express-promise-router");
const router = new Router;
const ReservationController = require("../controller/reservation");
const IdentificationJWTMiddelWare = require("../middleware/Identification");
const AuthorizationMiddelWare = require("../middleware/Authorization");

router.get("/client/:idClient", IdentificationJWTMiddelWare.identification, ReservationController.getClientReservations);
router.get("/day/:dateTimeReserved", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeWaiter, ReservationController.getDayReservations);
router.post("/", IdentificationJWTMiddelWare.identification, ReservationController.addReservation);
router.patch("/arrivingTime", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeWaiter, ReservationController.updateArrivingTime);
router.patch("/exitTime", IdentificationJWTMiddelWare.identification, AuthorizationMiddelWare.mustBeWaiter, ReservationController.updateExitTime);
router.patch("/cancel", IdentificationJWTMiddelWare.identification, ReservationController.cancelReservation);
router.patch("/", IdentificationJWTMiddelWare.identification, ReservationController.updateReservation); //TODO vérifier si on l'utilise

module.exports = router;