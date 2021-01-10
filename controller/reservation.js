const pool = require('../model/database');
const ReservationModel = require("../model/reservation");
const { numericValues, allDefined } = require("../utils/values");

/**
 *@swagger
 *components:
 *  responses:
 *      ReservationAdded:
 *          description: La réservation a été ajoutée
 *      AddReservationBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      ReservationToAdd:
 *          description : Réservation à ajouter
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          idPerson:
 *                              type: integer
 *                          dateTimeReserved:
 *                              type: string
 *                              format: date-time
 *                          nbCustomers:
 *                              type: integer
 *                          idTable:
 *                              type: integer
 *                          idEstablishment:
 *                              type: integer
 *                          additionalInformation:
 *                             type: string
 *                      required:
 *                          - idPerson
 *                          - dateTimeReserved
 *                          - nbCustomers
 *                          - idTable
 *                          - idEstablishment
 */

module.exports.addReservation = async (req, res) => {
	const {idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment, additionalInformation} = req.body;

	if (!numericValues(idPerson, nbCustomers, idTable, idEstablishment) || dateTimeReserved === undefined)
		res.sendStatus(400);
	else {
		const client = await pool.connect();
		try {
			await client.query("BEGIN");
			await ReservationModel.addReservation(client, idPerson, dateTimeReserved.replace("T", " ").replace(":SSS", ""), nbCustomers, idTable, idEstablishment);

			if(additionalInformation !== undefined)
				await ReservationModel.updateAdditionalInformations(client, idPerson, dateTimeReserved, additionalInformation);

			await client.query("COMMIT");
			res.sendStatus(201);
		} catch (error) {
			await client.query("ROLLBACK");

			console.log(error);

			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *      type: object
 *      properties:
 *         person_id:
 *           type: integer
 *         dateTimeReserved:
 *            type: string
 *            format: date-time
 *         arrivingTime:
 *           type: string
 *           format: time
 *         exitTime:
 *           type: string
 *           format: time
 *         customerNbr:
 *           type: integer
 *         additionnalInfo:
 *           type: string
 *         isCancelled:
 *           type: boolean
 *         tableId:
 *           type: integer
 *         isOutside:
 *            type: boolean
 *         customer:
 *           type: object
 *           properties:
 *              username:
 *                type: string
 *              lastName:
 *                type: string
 *              firstName:
 *                type: string
 *              phoneNumber:
 *                type: string
 *              email:
 *                type: string
 */

/**
 *@swagger
 *components:
 *  responses:
 *      ArrayOfClientReservations:
 *          description: Renvoie toutes réservations d'un client
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Reservation'
 *      ClientReservationsRetrievedBadRequest:
 *          description: L'id du client doit être définis

 */

module.exports.getClientReservations = async (req,res) => {
	const idClient = parseInt(req.params.idClient);
	if(isNaN(idClient)) {
		res.sendStatus(400);
	} else {
		const client = await pool.connect();
		try {
			const {rows : reservations } = await ReservationModel.getClientReservations(client, idClient);
			if(reservations.length !== 0) {
				res.json(reservations);
			} else {
				res.sendStatus(404);
			}
		} catch (error) {
			console.log(error);
			res.sendStatus(500);

			console.log(error);
		} finally {
			client.release();
		}
	}
}

/**
 *@swagger
 *components:
 *  responses:
 *      ArrayOfDayReservations:
 *          description: Renvoie toutes réservations d'un jour
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Reservation'
 *      DayReservationsRetrievedBadRequest:
 *          description: Le jour doit être définis

 */

module.exports.getDayReservations = async (req, res) => {
	const { establishmentId } = req.params;
	const day = req.params.dateTimeReserved; // format YYYY-MM-DD
	if(day === undefined) {
		res.sendStatus(400);
	} else {
		const client = await pool.connect();
		try {
			const {rows : reservations } = await ReservationModel.getDayReservations(client, day, establishmentId);
			if(reservations.length !== 0) {
				const result = reservations.map(reservation => {
					return {
						personId: reservation.personId,
						dateTimeReserved: reservation.dateTimeReserved,
						arrivingTime: reservation.arrivingTime,
						exitTime: reservation.exitTime,
						customersNbr: reservation.customersNbr,
						additionalInfo: reservation.additionalInfo,
						isCancelled: reservation.isCancelled,
						tableId: reservation.tableId,
						isOutside: reservation.isOutside,
						customer: {
							username: reservation.username,
							lastName: reservation.lastName,
							firstName: reservation.firstName,
							phoneNumber: reservation.phoneNumber,
							email: reservation.email
						}
					}
				});

				res.json(result);
			} else {
				res.sendStatus(404);
			}
		} catch (error) {
			console.log(error);
			res.sendStatus(500);

			console.log(error);
		}finally {
			client.release();
		}
	}
}

/**
 *@swagger
 *components:
 *  responses:
 *      ArrivingTimeUpdated:
 *          description: L'heure d'arrivée du client a été modifiée
 *      UpdateArrivingTimeBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      ArrivingTimeToUpdate:
 *          description : Heure d'arrivée du client à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          idPerson:
 *                              type: integer
 *                          dateTimeReserved:
 *                              type: string
 *                              format: date-time
 *                          arrivingTime:
 *                              type: string
 *                              format: time
 *                      required:
 *                          - idPerson
 *                          - dateTimeReserved
 *                          - arrivingTime
 */

module.exports.updateArrivingTime = async (req, res) => {
	const {idPerson, dateTimeReserved, arrivingTime} = req.body;

	if(isNaN(idPerson) || dateTimeReserved === undefined || arrivingTime === undefined) {
		res.sendStatus(400);
	} else {
		const client = await pool.connect();
		try {
			const rowsUpdated = await ReservationModel.updateArrivingTime(client, idPerson, dateTimeReserved, arrivingTime);
			if(rowsUpdated.rowCount !== 0)
				res.sendStatus(204);
			else
				res.sendStatus(404);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);

			console.log(error);
		} finally {
			client.release();
		}
	}
}

/**
 *@swagger
 *components:
 *  responses:
 *      ExitTimeUpdated:
 *          description: L'heure de sortie du client a été modifiée
 *      UpdateExitTimeBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      ExitTimeToUpdate:
 *          description : Heure de sortie du client à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          idPerson:
 *                              type: integer
 *                          dateTimeReserved:
 *                              type: string
 *                              format: date-time
 *                          exitTime:
 *                              type: string
 *                              format: time
 *                      required:
 *                          - idPerson
 *                          - dateTimeReserved
 *                          - exitTime
 */

module.exports.updateExitTime = async (req, res) => {
	const {idPerson, dateTimeReserved, exitTime} = req.body;
	if(isNaN(idPerson) || !allDefined(dateTimeReserved, exitTime))
		res.sendStatus(400);
	else {
		const client = await pool.connect();
		try {
			const rowsUpdated = await ReservationModel.updateExitTime(client, idPerson, dateTimeReserved, exitTime);
			if(rowsUpdated.rowCount !== 0)
				res.sendStatus(204);
			else
				res.sendStatus(404);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);

			console.log(error);
		} finally {
			client.release();
		}
	}
}

/**
 *@swagger
 *components:
 *  responses:
 *      ReservationCanceled:
 *          description: La réservation a été annulée
 *      ToCancelBadRequest:
 *          description: L'id de la personne et la date de réservation doivent être définis
 *  requestBodies:
 *      ReservationToCancel:
 *          description : Annule la réservation d'un client
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          idPerson:
 *                              type: integer
 *                          dateTimeReserved:
 *                              type: string
 *                              format: date-time
 *                      required:
 *                          - idPerson
 *                          - dateTimeReserved
 */

module.exports.cancelReservation = async (req, res) => {
	const {idPerson, dateTimeReserved} = req.body;
	if(isNaN(idPerson) || dateTimeReserved === undefined) {
		res.sendStatus(400);
	} else {
		const client = await pool.connect();
		try {
			const rowsCancelled = await ReservationModel.cancelReservation(client, idPerson, dateTimeReserved);
			if(rowsCancelled.rowCount !== 0)
				res.sendStatus(204);
			else
				res.sendStatus(404);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}
