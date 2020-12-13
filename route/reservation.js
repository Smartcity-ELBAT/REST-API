const Router = require("express-promise-router");
const router = new Router;
const ReservationController = require("../controller/reservation");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");

/**
 * @swagger
 *
 * components:
 *   responses:
 *     ClientReservationsToGetBadRequest:
 *       description: Mauvaise requête pour la récupération des réservation d'un client
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/ClientReservationsToGetBadRequestResponse'
 *
 *   schemas:
 *     ClientReservationsToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/ClientReservationsRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /reservation/client/{idClient}:
 *  get:
 *      tags:
 *          - Reservation
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie toutes les réservations d'un client
 *      parameters:
 *        - name: idClient
 *          description: ID d'un client
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ArrayOfClientReservations'
 *          400:
 *              $ref: '#/components/responses/ClientReservationsToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: Les réservations du client n'ont pas été trouvées
 *          500:
 *              description: Erreur serveur
 */

router.get("/client/:idClient", IdentificationJWTMiddleWare.identification, ReservationController.getClientReservations);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     DayReservationsToGetBadRequest:
 *       description: Mauvaise requête pour la récupération des réservation d'un jour
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/DayReservationsToGetBadRequestResponse'
 *
 *   schemas:
 *     DayReservationsToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/DayReservationsRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /reservation/{establishmentId}/{dateTimeReserved}:
 *  get:
 *      tags:
 *          - Reservation
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie toutes les réservations d'un jour
 *      parameters:
 *        - name: establishmentId
 *          description: établissement pour lequel on veut les réservations du jour
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *        - name: dateTimeReserved
 *          description: jour au format YYYY-MM-DD
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ArrayOfDayReservations'
 *          400:
 *              $ref: '#/components/responses/DayReservationsToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeWaiter'
 *          404:
 *              description: Les réservations du jour our cet établissement n'ont pas été trouvées
 *          500:
 *              description: Erreur serveur
 */

router.get("/day/:dateTimeReserved", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, ReservationController.getDayReservations);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     ReservationToAddBadRequest:
 *       description: Mauvaise requête pour l'ajout d'une réservation
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/ReservationToAddBadRequestResponse'
 *
 *   schemas:
 *     ReservationToAddBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/AddReservationBadRequest'
 */

/**
 * @swagger
 *
 * /reservation:
 *  post:
 *      tags:
 *          - Reservation
 *      security:
 *          - bearerAuth: []
 *      description: Ajoute une réservation
 *      requestBody:
 *          $ref: '#/components/requestBodies/ReservationToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ReservationAdded'
 *          400:
 *              $ref: '#/components/responses/ReservationToAddBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          500:
 *              description: Erreur serveur
 */

router.post("/", IdentificationJWTMiddleWare.identification, ReservationController.addReservation);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     ArrivingTimeToUpdateBadRequest:
 *       description: Mauvaise requête pour la mise à jour de l'heure d'arrivée d'un client
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/ArrivingTimeToUpdateBadRequestResponse'
 *
 *   schemas:
 *     ArrivingTimeToUpdateBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UpdateArrivingTimeBadRequest'
 */

/**
 * @swagger
 *
 * /reservation/arrivingTime:
 *  patch:
 *      tags:
 *          - Reservation
 *      security:
 *          - bearerAuth: []
 *      description: Met à jour de l'heure d'arrivée du client
 *      requestBody:
 *          $ref: '#/components/requestBodies/ArrivingTimeToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ArrivingTimeUpdated'
 *          400:
 *              $ref: '#/components/responses/ArrivingTimeToUpdateBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeWaiter'
 *          404:
 *              description: La réservation du client n'a pas été trouvée
 *          500:
 *              description: Erreur serveur
 */

router.patch("/arrivingTime", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, ReservationController.updateArrivingTime);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     ExitTimeToUpdateBadRequest:
 *       description: Mauvaise requête pour la mise à jour de l'heure de sortie d'un client
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/ExitTimeToUpdateBadRequestResponse'
 *
 *   schemas:
 *     ExitTimeToUpdateBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UpdateExitTimeBadRequest'
 */

/**
 * @swagger
 *
 * /reservation/exitTime:
 *  patch:
 *      tags:
 *          - Reservation
 *      security:
 *          - bearerAuth: []
 *      description: Met à jour de l'heure de sortie du client
 *      requestBody:
 *          $ref: '#/components/requestBodies/ExitTimeToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ExitTimeUpdated'
 *          400:
 *              $ref: '#/components/responses/ExitTimeToUpdateBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeWaiter'
 *          404:
 *              description: La réservation du client n'a pas été trouvée
 *          500:
 *              description: Erreur serveur
 */

router.patch("/exitTime", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, ReservationController.updateExitTime);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     ReservationToCancelBadRequest:
 *       description: Mauvaise requête pour l'annulation de la réservation d'un client
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/ReservationToCancelBadRequestResponse'
 *
 *   schemas:
 *     ReservationToCancelBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/ToCancelBadRequest'
 */

/**
 * @swagger
 *
 * /reservation/cancel:
 *  patch:
 *      tags:
 *          - Reservation
 *      security:
 *          - bearerAuth: []
 *      description: Annule la réservation d'un client
 *      requestBody:
 *          $ref: '#/components/requestBodies/ReservationToCancel'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ReservationCanceled'
 *          400:
 *              $ref: '#/components/responses/ReservationToCancelBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeWaiter'
 *          404:
 *              description: La réservation du client n'a pas été trouvée
 *          500:
 *              description: Erreur serveur
 */

router.patch("/cancel", IdentificationJWTMiddleWare.identification, ReservationController.cancelReservation);

module.exports = router;