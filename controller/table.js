const pool = require('../model/database');
const TableModel = require('../model/table');
const EstablishmentModel = require('../model/establishment');

module.exports.addTable = async (req, res) => {
    const {idEstablishment, nbSeats, isOutside} = req.body;
    if(isNaN(idEstablishment) || nbSeats === undefined || isOutside === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const {rows : establishments} = await EstablishmentModel.getEstablishment(client, idEstablishment);
            const establishment = establishments[0];

            if(establishment !== undefined) {
                await TableModel.addTable(client, idEstablishment, nbSeats, isOutside);
                res.sendStatus(201);
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

module.exports.getAllTables = async (req, res) => {
    const idEstablishment = parseInt(req.params.idEstablishment);
    if(isNaN(idEstablishment)){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const {rows : tables} = await TableModel.getAllTables(client, idEstablishment);
            if(tables.length !== 0) {
                res.json(tables);
            } else {
                res.sendStatus(404);
            }
        } catch(error) {
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getTable = async (req, res) => {
    const idEstablishment = parseInt(req.params.idEstablishment);
    const idTable = parseInt(req.params.idTable);

    if(isNaN(idEstablishment) || isNaN(idTable)){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const {rows : tables} = await TableModel.getTable(client, idTable, idEstablishment);
            const table = tables[0];

            if(table !== undefined) {
                res.json(table);
            } else {
                res.sendStatus(404);
            }
        } catch(error) {
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.updateTable = async (req, res) => {
    const {idTable, idEstablishment, isOutside} = req.body;
    if(isNaN(idTable) || isNaN(idEstablishment) || isOutside === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const rowsUpdated = await TableModel.updateTable(client, idTable, idEstablishment, isOutside);
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

module.exports.deleteTable = async (req, res) => {
    const {idTable, idEstablishment} = req.body;
    if(isNaN(idTable) || isNaN(idEstablishment)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            const rowsDeleted = await TableModel.deleteTable(client, idTable, idEstablishment);
            if(rowsDeleted.rowCount !== 0)
                res.sendStatus(204);
            else
                res.sendStatus(404);
        } catch (error) {
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}


