const pool = require('../model/database');
const ReservationModel = require("../model/reservation");
const { numericValues, allDefined } = require("../utils/values");

module.exports.addReservation = async (req, res) => {
    const {idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment, additionalInformation} = req.body;

    if (!numericValues(idPerson, nbCustomers, idTable, idEstablishment) || dateTimeReserved === undefined)
        res.sendStatus(400);
    else {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await ReservationModel.addReservation(client, idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment);

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

module.exports.updateArrivingTime = async (req, res) => {
    const {idPerson, dateTimeReserved, arrivingTime} = req.body;

    if(isNaN(idPerson) || dateTimeReserved === undefined || arrivingTime === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const rowsUpdated = await ReservationModel.updateArrivingTime(client, idPerson, dateTimeReserved, arrivingTime);
            if(rowsUpdated.rowCount !== 0)
                res.sendStatus(200);
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

module.exports.updateExitTime = async (req, res) => {
    const {idPerson, dateTimeReserved, exitTime} = req.body;
    if(isNaN(idPerson) || !allDefined(dateTimeReserved, exitTime))
        res.sendStatus(400);
    else {
        const client = await pool.connect();
        try {
            const rowsUpdated = await ReservationModel.updateExitTime(client, idPerson, dateTimeReserved, exitTime);
            if(rowsUpdated.rowCount !== 0)
                res.sendStatus(200);
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

module.exports.cancelReservation = async (req, res) => {
    const {idPerson, dateTimeReserved} = req.body;
    if(isNaN(idPerson) || dateTimeReserved === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const rowsCancelled = await ReservationModel.cancelReservation(client, idPerson, dateTimeReserved);
            if(rowsCancelled.rowCount !== 0)
                res.sendStatus(200);
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
