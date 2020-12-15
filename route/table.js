const Router = require("express-promise-router");
const router = new Router;
const TableController = require("../controller/table");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");

/**
 * @swagger
 *
 * components:
 *   responses:
 *     TablesToGetBadRequest:
 *       description: Mauvaise requête pour la récupération des tables
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/TablesToGetBadRequestResponse'
 *
 *   schemas:
 *     TablesToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/AllTablesRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /table/{idEstablishment}:
 *  get:
 *      tags:
 *          - Table
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie la liste de toutes les tables d'un établissement
 *      parameters:
 *        - name: idEstablishment
 *          description: ID d'un établissement
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ArrayOfTables'
 *          400:
 *              $ref: '#/components/responses/TablesToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: Les tables de l'établissement n'ont pas été trouvées
 *          500:
 *              description: Erreur serveur
 */

router.get("/:idEstablishment", IdentificationJWTMiddleWare.identification, TableController.getAllTables);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     TableToGetBadRequest:
 *       description: Mauvaise requête pour la récupération d'une table
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/TableToGetBadRequestResponse'
 *
 *   schemas:
 *     TableToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/TableRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /table/{idEstablishment}/{idTable}:
 *  get:
 *      tags:
 *          - Table
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie une table d'un établissement
 *      parameters:
 *        - name: idEstablishment
 *          description: ID d'un établissement
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *        - name: idTable
 *          description: ID d'une table d'un établissement
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/TableFound'
 *          400:
 *              $ref: '#/components/responses/TableToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: La table de l'établissement n'a pas été trouvée
 *          500:
 *              description: Erreur serveur
 */

router.get("/:idEstablishment/:idTable", IdentificationJWTMiddleWare.identification, TableController.getTable);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     TableToAddBadRequest:
 *       description: Mauvaise requête pour l'ajout de la table
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/TableToAddBadRequestResponse'
 *
 *   schemas:
 *     TableToAddBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/AddTableBadRequest'
 */

/**
 * @swagger
 *
 * /table:
 *  post:
 *      tags:
 *          - Table
 *      security:
 *          - bearerAuth: []
 *      description: Ajoute une table à un établissement
 *      requestBody:
 *          $ref: '#/components/requestBodies/TableToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/TableAdded'
 *          400:
 *              $ref: '#/components/responses/TableToAddBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: L'établissement est inconnu
 *          500:
 *              description: Erreur serveur
 */

router.post("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, TableController.addTable);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     TableToDeleteBadRequest:
 *       description: Mauvaise requête pour la suppression de la table
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/TableToDeleteBadRequestResponse'
 *
 *   schemas:
 *     TableToDeleteBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/DeleteTableBadRequest'
 */

/**
 * @swagger
 *
 * /table:
 *  delete :
 *      tags:
 *          - Table
 *      security:
 *          - bearerAuth: []
 *      description: Supprime une table
 *      requestBody:
 *          $ref: '#/components/requestBodies/TableToDelete'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/TableDeleted'
 *          400:
 *              $ref: '#/components/responses/TableToDeleteBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: La table n'a pas été trouvée dans la base de données
 *          500:
 *              description: Erreur serveur
 */

router.delete("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, TableController.deleteTable);

module.exports = router;