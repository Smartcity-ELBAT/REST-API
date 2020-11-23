const pool = require('../model/database');
const ReservationModel = require("../model/reservation");
const TableModel = require("../model/table");

module.exports.addReservation = async (req, res) => {
    const {idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment, additionnalInformation} = req.body;

    if(isNaN(idPerson) || dateTimeReserved === undefined || isNaN(nbCustomers) || isNaN(idTable) || isNaN(idEstablishment)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await ReservationModel.addReservation(client, idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment);

            if(additionnalInformation !== undefined)
                await ReservationModel.updateAdditionalInformations(client, idPerson, dateTimeReserved, additionnalInformation);

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
                for (const row of reservations)
                    console.log(new Date(row.timezone));
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
    const day = req.params.dateTimeReserved; // format YYYY-MM-DD
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

module.exports.updateReservation = async (req, res) => {
    const {idPerson, dateTimeReserved, newDateTime, nbCustomers, addInfos, idTable, idEstablishment} = req.body
    if(isNaN(idPerson) || dateTimeReserved === undefined || isNaN(nbCustomers) || isNaN(idTable) || isNaN(idEstablishment)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const table = await TableModel.getTable(client, idTable, idEstablishment);
            if(table.rowCount === 0) {
                res.sendStatus(404);
            } else {
                const rowsUpdated = await ReservationModel.updateReservation(client,
                                                                            idPerson,
                                                                            dateTimeReserved,
                                                                            newDateTime === undefined ? dateTimeReserved : newDateTime,
                                                                            nbCustomers,
                                                                            addInfos,
                                                                            idTable,
                                                                            idEstablishment);
                if(rowsUpdated.rowCount !== 0)
                    res.sendStatus(204);
                else
                    res.sendStatus(404);            }
        } catch (error) {
            res.sendStatus(500);
        } finally {
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
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.updateExitTime = async (req, res) => {
    const {idPerson, dateTimeReserved, exitTime} = req.body;
    if(isNaN(idPerson) || dateTimeReserved === undefined || exitTime === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const rowsUpdated = await ReservationModel.updateExitTime(client, idPerson, dateTimeReserved, exitTime);
            if(rowsUpdated.rowCount !== 0)
                res.sendStatus(200);
            else
                res.sendStatus(404);
        } catch (error) {
            res.sendStatus(500);
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
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}