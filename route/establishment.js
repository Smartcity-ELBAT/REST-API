const EstablishmentController = require("../controller/establishment");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");
const Router = require("express-promise-router");
const router = new Router;

/**
 * @swagger
 *
 * components:
 *   responses:
 *     EstablishmentToGetBadRequest:
 *       description: Mauvaise requête pour la récupération d'un établissement
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/EstablishmentToGetBadRequestResponse'
 *
 *   schemas:
 *     EstablishmentToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/EstablishmentRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /establishment/{id}:
 *  get:
 *      tags:
 *          - Establishment
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie un établissement
 *      parameters:
 *        - name: id
 *          description: ID d'un établissement
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/EstablishmentFound'
 *          400:
 *              $ref: '#/components/responses/EstablishmentToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: Les établissements n'ont pas été trouvés
 *          500:
 *              description: Erreur serveur
 */

router.get("/:id",IdentificationJWTMiddleWare.identification, EstablishmentController.getEstablishment);

/**
 * @swagger
 *
 * /establishment:
 *  get:
 *      tags:
 *          - Establishment
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie la liste de tous les établissements
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ArrayOfEstablishments'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: Les tables de l'établissement n'ont pas été trouvées
 *          500:
 *              description: Erreur serveur
 */

router.get("/", IdentificationJWTMiddleWare.identification, EstablishmentController.getAllEstablishments);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     EstablishmentToAddBadRequest:
 *       description: Mauvaise requête pour l'ajout d'un établissement
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/EstablishmentToAddBadRequestResponse'
 *
 *   schemas:
 *     EstablishmentToAddBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/AddEstablishmentBadRequest'
 */

/**
 * @swagger
 *
 * /establishment:
 *  post:
 *      tags:
 *          - Establishment
 *      security:
 *          - bearerAuth: []
 *      description: Ajoute un établissement et renvoie son id
 *      requestBody:
 *          $ref: '#/components/requestBodies/EstablishmentToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/EstablishmentAdded'
 *          400:
 *              $ref: '#/components/responses/EstablishmentToAddBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Erreur serveur
 */

router.post("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, EstablishmentController.addEstablishment);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     EstablishmentToUpdateBadRequest:
 *       description: Mauvaise requête pour la mise à jour d'un établissement
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/EstablishmentToUpdateBadRequestResponse'
 *
 *   schemas:
 *     EstablishmentToUpdateBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UpdateEstablishmentBadRequest'
 */

/**
 * @swagger
 *
 * /establishment:
 *  patch:
 *      tags:
 *          - Establishment
 *      security:
 *          - bearerAuth: []
 *      description: Modifie un établissement
 *      requestBody:
 *          $ref: '#/components/requestBodies/EstablishmentToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/EstablishmentUpdated'
 *          400:
 *              $ref: '#/components/responses/EstablishmentToUpdateBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: L'établissement ou son adresse n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */

router.patch("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, EstablishmentController.patchEstablishment);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     EstablishmentToDeleteBadRequest:
 *       description: Mauvaise requête pour la suppression d'un établissement
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/EstablishmentToDeleteBadRequestResponse'
 *
 *   schemas:
 *     EstablishmentToDeleteBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/DeleteEstablishmentBadRequest'
 */

/**
 * @swagger
 *
 * /establishment:
 *  delete :
 *      tags:
 *          - Establishment
 *      security:
 *          - bearerAuth: []
 *      description: Supprime un établissement
 *      requestBody:
 *          $ref: '#/components/requestBodies/EstablishmentToDelete'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/EstablishmentDeleted'
 *          400:
 *              $ref: '#/components/responses/EstablishmentToDeleteBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: L'établissement n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */

router.delete("/", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, EstablishmentController.deleteEstablishment);

module.exports = router;