const pool = require('../model/database');
const TableModel = require('../model/table');
const EstablishmentModel = require('../model/establishment');
const { allDefined } = require("../utils/values");

/**
 *@swagger
 *components:
 *  responses:
 *      TableAdded:
 *          description: La table a été ajoutée
 *      AddTableBadRequest:
 *          description: L'id de l'établissement, le nombre de siège et l'emplacement de la table doivent être définis
 *  requestBodies:
 *      TableToAdd:
 *          description : Table à ajouter à un établissement
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          idEstablishment:
 *                              type: integer
 *                          nbSeats:
 *                              type: integer
 *                          isOutside:
 *                              type: boolean
 *                      required:
 *                          - idEstablishment
 *                          - nbSeats
 *                          - isOutside
 */

module.exports.addTable = async (req, res) => {
    const {idEstablishment, nbSeats, isOutside} = req.body;
    if(isNaN(idEstablishment) || isNaN(nbSeats) || !allDefined(isOutside)) {
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
 *     Table:
 *       type: object
 *       properties:
 *         idTable:
 *           type: integer
 *         idEstablishment:
 *           type : integer
 *         nbSeats:
 *           type: integer
 *         isOutside:
 *           type: boolean
 *
 */

/**
 *@swagger
 *components:
 *  responses:
 *      ArrayOfTables:
 *          description: Renvoie toutes les tables d'un établissement
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Table'
 *      AllTablesRetrievedBadRequest:
 *          description: L'id de l'établissement doit être définis
 */

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
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      TableFound:
 *          description: Renvoie une table d'un établissement
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Table'
 *      TableRetrievedBadRequest:
 *          description: L'id de l'établissement et l'id de la table doivent être définis
 */

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
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      TableDeleted:
 *          description: La table a été supprimée
 *      DeleteTableBadRequest:
 *          description: L'id de l'établissement et l'id de la table doivent être définis
 *  requestBodies:
 *      TableToDelete:
 *          description : Table à supprimer d'un établissement
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          idEstablishment:
 *                              type: integer
 *                          idTable:
 *                              type: integer
 *                      required:
 *                          - idEstablishment
 *                          - idTable
 */

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
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      ArrayOfTables:
 *          description: Renvoie toutes les tables non occupées d'un établissement pour telle date
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Table'
 *      AllTablesRetrievedBadRequest:
 *          description: L'id de l'établissement doit être définis
 */

module.exports.getAllAvailableTables = async (req, res) => {
    const establishmentId = parseInt(req.params.establishmentId);
    const {chosenDate} = req.params;

    if (isNaN(establishmentId))
        res.sendStatus(400);
    else {
        const client = await pool.connect();

        try {
            const {rows: tables} = await TableModel.getAllAvailableTables(client, establishmentId, chosenDate);

            res.json(tables);
        } catch (error) {
            console.log(error);

            res.sendStatus(500);
        } finally {
            await client.release();
        }
    }
}
