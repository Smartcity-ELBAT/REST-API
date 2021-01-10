const Router = require("express-promise-router");
const router = new Router;
const Controller = require("../controller/person");
const IdentificationJWTMiddleWare = require("../middleware/Identification");
const AuthorizationMiddleWare = require("../middleware/Authorization");

router.patch("/updateCovid/:id", IdentificationJWTMiddleWare.identification, Controller.updatePositiveToCovid);

// Android
router.get("/customer/:id", IdentificationJWTMiddleWare.identification, Controller.getUserById);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserbyUsernameToGetBadRequest:
 *       description: Mauvaise requête pour la récupération d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserbyUsernameToGetBadRequestResponse'
 *
 *   schemas:
 *     UserbyUsernameToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UserbyUsernameRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /person/one/username/{username}:
 *  get:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie un utilisateur sur base de son nom d'utilisateur
 *      parameters:
 *        - name: username
 *          description: nom d'utilisateur d'une personne
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserbyUsernameFound'
 *          400:
 *              $ref: '#/components/responses/UserbyUsernameToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: L'utilisateur n'a pas été trouvé
 *          500:
 *              description: Erreur serveur
 */

router.get("/one/username/:username", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.getUser);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserbyPhoneToGetBadRequest:
 *       description: Mauvaise requête pour la récupération d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserbyPhoneToGetBadRequestResponse'
 *
 *   schemas:
 *     UserbyPhoneToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UserbyPhoneRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /person/one/phoneNumber/{phoneNumber}:
 *  get:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie un utilisateur sur base de son numéro de téléphone
 *      parameters:
 *        - name: phoneNumber
 *          description: numéro de téléphone d'une personne
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserbyPhoneFound'
 *          400:
 *              $ref: '#/components/responses/UserbyPhoneToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeWaiter'
 *          404:
 *              description: L'utilisateur n'a pas été trouvé
 *          500:
 *              description: Erreur serveur
 */

router.get("/one/phoneNumber/:phoneNumber", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeWaiter, Controller.getUserByPhoneNumber);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UsersByEstablishmentIdToGetBadRequest:
 *       description: Mauvaise requête pour la récupération des serveurs d'un restaurant
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UsersByEstablishmentIdToGetBadRequestResponse'
 *
 *   schemas:
 *     UsersByEstablishmentIdToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UsersByEstablishmentIdRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /person/waiters/{establishmentId}:
 *  get:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie tous les serveurs d'un restaurant
 *      parameters:
 *        - name: establishmentId
 *          description: id d'un établissement
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UsersByEstablishmentIdFound'
 *          400:
 *              $ref: '#/components/responses/UsersByEstablishmentIdToGetBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Les serveurs de cet établissement n'ont pas été trouvés
 *          500:
 *              description: Erreur serveur
 */

router.get("/waiters/:establishmentId", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.getUsersByEstablishmentId);

/**
 * @swagger
 *
 * /person/all:
 *  get:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie tous utilisateurs
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UsersFound'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Les utilisateurs n'ont pas été trouvés
 *          500:
 *              description: Erreur serveur
 */

router.get("/all", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.getAllUsers);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserToAddBadRequest:
 *       description: Mauvaise requête pour l'ajout d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserToAddBadRequestResponse'
 *
 *   schemas:
 *     UserToAddBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/AddUserBadRequest'
 */

/**
 * @swagger
 *
 * /person:
 *  post:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Ajoute un utilisateur
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/UserAdded'
 *          400:
 *              $ref: '#/components/responses/UserToAddBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          500:
 *              description: Erreur serveur
 */

//router.post("/", IdentificationJWTMiddleWare.identification, Controller.addUser);
router.post("/", Controller.addUser);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserToUpdateBadRequest:
 *       description: Mauvaise requête pour la mise à jour d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserToUpdateBadRequestResponse'
 *
 *   schemas:
 *     UserToUpdateBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UpdateUserBadRequest'
 */

/**
 * @swagger
 *
 * /person:
 *  patch:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Modifie un utilisateur
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserUpdated'
 *          400:
 *              $ref: '#/components/responses/UserToUpdateBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: L'utilisateur ou son adresse n'a pas été trouvé dans la base de données
 *          403:
 *              description: Seul l'administrateur peut modifier une autre personne que lui-même
 *          500:
 *              description: Erreur serveur
 */

router.patch("/", IdentificationJWTMiddleWare.identification, Controller.updateUser);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     PasswordToUpdateBadRequest:
 *       description: Mauvaise requête pour la mise à jour du mot de passe d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/PasswordToUpdateBadRequestResponse'
 *
 *   schemas:
 *     PasswordToUpdateBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UpdatePasswordBadRequest'
 */

/**
 * @swagger
 *
 * components:
 *   responses:
 *     PasswordToUpdateUnauthorized:
 *       description: Mauvaise authorisation pour la mise à jour du mot de passe d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/PasswordToUpdateUnauthorizedResponse'
 *
 *   schemas:
 *     PasswordToUpdateUnauthorizedResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/UnauthorizedJWT'
 *         - $ref: '#/components/responses/UpdatePasswordUnauthorized'
 */

/**
 * @swagger
 *
 * /person/updatePassword:
 *  patch:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Modifie le mot de passe d'un utilisateur
 *      requestBody:
 *          $ref: '#/components/requestBodies/PasswordToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PasswordUpdated'
 *          400:
 *              $ref: '#/components/responses/PasswordToUpdateBadRequest'
 *          401:
 *              $ref: '#/components/responses/PasswordToUpdateUnauthorized'
 *          404:
 *              description: L'utilisateur n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */

router.patch("/updatePassword", IdentificationJWTMiddleWare.identification, Controller.updatePassword);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserToLinkBadRequest:
 *       description: Mauvaise requête pour la liaison d'un utilisateur à un établissement
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserToLinkBadRequestResponse'
 *
 *   schemas:
 *     UserToLinkBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/LinkUserBadRequest'
 */

/**
 * @swagger
 *
 * /person/addToEstablishment:
 *  patch:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Lie un utilisateur à un établissement
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToLink'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserLinkedToEstablishment'
 *          400:
 *              $ref: '#/components/responses/UserToLinkBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: L'utilisateur ou son établissement n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */

router.patch("/addToEstablishment", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.linkUserToEstablishment);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserToUnlinkBadRequest:
 *       description: Mauvaise requête pour la séparation d'un serveur d'un établissement
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserToUnlinkBadRequestResponse'
 *
 *   schemas:
 *     UserToUnlinkBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UnlinkUserBadRequest'
 */

/**
 * @swagger
 *
 * /person/removeFromEstablishment:
 *  patch:
 *      tags:
 *          - Person
 *      security:
 *          - bearerAuth: []
 *      description: Détache un serveur d'un établissement
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToUnlink'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserUnlinkedFromEstablishment'
 *          400:
 *              $ref: '#/components/responses/UserToUnlinkBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: L'utilisateur ou son établissement n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */

router.delete("/removeFromEstablishment", IdentificationJWTMiddleWare.identification, AuthorizationMiddleWare.mustBeAdmin, Controller.unlinkUserFromEstablishment);

module.exports = router;