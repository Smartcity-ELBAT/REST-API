const pool = require('../model/database');
const ReservationModel = require("../model/reservation");

module.exports.addReservation = async (req, res) => {
    const {idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment, additionnalInformation} = req.body;

    if(isNaN(idPerson) || dateTimeReserved === undefined || isNaN(nbCustomers) ||
        isNaN(idTable) || isNaN(idEstablishment)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await ReservationModel.addReservation(client, idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment);

            if(additionnalInformation !== undefined)
                await ReservationModel.updateAdditionalInformation(client, idPerson, dateTimeReserved, additionnalInformation);

            await client.query("COMMIT");
            res.sendStatus(201);
        } catch (error) {
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
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getDayReservations = async (req, res) => {
    const day = req.params.day; // format YYY-MM-DD HH24:MI
    if(day === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const {rows : reservations } = await ReservationModel.getDayReservations(client, day);
            if(reservations.length !== 0) {
                res.json(reservations);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.sendStatus(500);
        }finally {
            client.release();
        }
    }
}


