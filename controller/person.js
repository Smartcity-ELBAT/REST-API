const Address = require("../model/address");
const Person = require("../model/person");
const pool = require("../model/database");
const { getPasswordHash, matchPasswords } = require("../utils/passwords");
const { allDefined, numericValues } = require("../utils/values");

//Android
module.exports.getUserById = async (req, res) => {
	const id = req.params.id;

	if (isNaN(id))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getUserById(client, id);

			if (user !== undefined) {
				let userRetrieve = {
					id : user.id,
					username : user.username,
					lastName : user.lastName,
					firstName : user.firstName,
					birthDate : user.birthDate,
					email : user.email,
					phoneNumber : user.phoneNumber,
					gender : user.gender,
					address : {
						id : user.addressId,
						street : user.street,
						number : user.number,
						postalCode : user.postalCode,
						city : user.city,
						country : user.country
					}
				}
				res.json(userRetrieve);
			}
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
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type : string
 *         password:
 *           type: string
 *           format: password
 *         lastName:
 *           type: string
 *         firstName:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         email:
 *           type: string
 *         addressId:
 *           type: string
 *         street:
 *           type: string
 *         number:
 *           type: string
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         postalCode:
 *           type: string
 */

/**
 *@swagger
 *components:
 *  responses:
 *      UserbyUsernameFound:
 *          description: Renvoie un utilisateur sur base de son nom d'utilisateur
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Person'
 *      UserbyUsernameRetrievedBadRequest:
 *          description: Le username doit être définis
 */

module.exports.getUser = async (req, res) => {
	const username = req.params.username;

	if (username === undefined)
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByUsername(client, username.toLowerCase());

			if (user !== undefined)
				res.json(user);
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
 *      UserbyPhoneFound:
 *          description: Renvoie un utilisateur sur base de son numéro de téléphone
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Person'
 *      UserbyPhoneRetrievedBadRequest:
 *          description: Le numéro de téléphone doit être définis
 */

module.exports.getUserByPhoneNumber = async (req, res) => {
	const phoneNumber = req.params.phoneNumber;

	if (phoneNumber === undefined)
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByPhoneNumber(client, phoneNumber);

			if (user !== undefined) {
				res.json(user);
			} else res.sendStatus(404);
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
 *      UsersByEstablishmentIdFound:
 *          description: Renvoie tous les serveurs d'un restaurant
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Person'
 *      UsersByEstablishmentIdRetrievedBadRequest:
 *          description: L'id de l'établissement doit être définit
 */

module.exports.getUsersByEstablishmentId = async (req, res) => {
	const establishmentId = req.params.establishmentId;

	if (isNaN(establishmentId))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const {rows: users} = await Person.getUsersByEstablishmentId(client, establishmentId);

			if (users !== undefined)
				res.json(users);
			else
				res.sendStatus(404);
		} catch (e) {
			console.log(e);
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
 *      UsersFound:
 *          description: Renvoie tous les utilisateurs
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  username:
 *                    type: string
 *                  password:
 *                    type: string
 *                  lastName:
 *                    type: string
 *                  firstName:
 *                    type: string
 *                  birthDate:
 *                   type: string
 *                   format: date
 *                  gender:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *                  email:
 *                    type: string
 *                  addressId:
 *                    type: integer
 */

module.exports.getAllUsers = async (req, res) => {
	const client = await pool.connect();

	try {
		const { rows: users } = await Person.getAllUsers(client);

		if (users.rowCount === 0)
			res.sendStatus(404);
		else {
			res.json(users);
		}
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	} finally {
		client.release();
	}
}

/**
 *@swagger
 *components:
 *  responses:
 *      UserAdded:
 *          description: L'utilisateur a été ajouté
 *      AddUserBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      UserToAdd:
 *          description : Utilisateur à ajouter
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *                          lastName:
 *                              type: string
 *                          firstName:
 *                              type: string
 *                          birthDate:
 *                              type: string
 *                              format: date
 *                          gender:
 *                             type: string
 *                          phoneNumber:
 *                              type: string
 *                          email:
 *                              type: string
 *                          address:
 *                              type: object
 *                              properties:
 *                                street:
 *                                  type: string
 *                                number:
 *                                  type: string
 *                                country:
 *                                  type: string
 *                                city:
 *                                  type: string
 *                                postalCode:
 *                                  type: string
 *                      required:
 *                          - username
 *                          - password
 *                          - lastName
 *                          - firstName
 *                          - birthDate
 *                          - gender
 *                          - phoneNumber
 *                          - email
 *                          - street
 *                          - number
 *                          - country
 *                          - city
 *                          - postalCode
 */

module.exports.addUser = async (req, res) => {
	const {
		username,
		password,
		lastName,
		firstName,
		birthDate,
		gender,
		phoneNumber,
		email
	} = req.body;
	const {
		street,
		number,
		country,
		city,
		postalCode
	} = req.body.address;

	if (!allDefined(username, password, lastName, firstName, birthDate, gender, phoneNumber, email, street, number, country, city, postalCode))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const addressId = await Address.addAddress(client, street, number, country, city, postalCode);
			await Person.addPerson(
				client,
				username.toLowerCase(),
				await getPasswordHash(password),
				lastName,
				firstName,
				birthDate,
				gender,
				phoneNumber.replace(/\/?\.?-?/, ""),
				email,
				addressId
			);

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
 *@swagger
 *components:
 *  responses:
 *      UserUpdated:
 *          description: L'utilisateur a été modifié
 *      UpdateUserBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      UserToUpdate:
 *          description : Utilisateur à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          firstName:
 *                              type: string
 *                          lastName:
 *                              type: string
 *                          birthDate:
 *                              type: string
 *                          gender:
 *                              type: string
 *                          phoneNumber:
 *                              type: string
 *                          email:
 *                              type: string
 *                          address:
 *                              type: object
 *                              properties:
 *                                  addressId:
 *                                      type: integer
 *                                  street:
 *                                      type: string
 *                                  number:
 *                                      type: string
 *                                  country:
 *                                      type: string
 *                                  city:
 *                                      type: string
 *                                  postalCode:
 *                                      type: string
 *                      required:
 *                          - firtsName
 *                          - lastName
 *                          - birthDate
 *                          - gender
 *                          - phoneNumber
 *                          - email
 *                          - addressId
 *                          - street
 *                          - number
 *                          - country
 *                          - city
 *                          - postalCode
 */

module.exports.updateUser = async (req, res) => {
	const { firstName, lastName, birthDate, gender, phoneNumber } = req.body
	const { street, number, postalCode, city, country } = req.body.address;
	let { id } = req.body;
	let { id: addressId } = req.body.address;

	if (!allDefined(lastName, firstName, birthDate, gender, phoneNumber, street, number, country, city, postalCode))
		res.sendStatus(400);
	else {
		if (
			((id !== undefined && id !== req.session.id)
				|| (addressId !== undefined && addressId !== req.session.addressId))
			&& req.session.authLevels.filter(authLevel => authLevel.accessLevel !== "admin").size === 1
		)
			res.sendStatus(403);
		else {
			id = id !== undefined ? id : req.session.id;
			addressId = addressId !== undefined ? addressId : req.session.addressId;

			const client = await pool.connect();

			try {
				await client.query("BEGIN");
        
	            const updatedAddressRows = await Address.updateAddress(client, addressId, street, number, country, city, postalCode);
				if (updatedAddressRows.rowCount !== 0) {
					const updatedUserRows = await Person.updatePersonalInfo(client, id, firstName, lastName, birthDate, gender, phoneNumber);

					await client.query("COMMIT");
					res.sendStatus(updatedUserRows.rowCount !== 0 ? 204 : 404);
				} else {
					await client.query("ROLLBACK");

					res.sendStatus(404);
				}
			} catch (e) {
				console.log(e);

				await client.query("ROLLBACK");

				res.sendStatus(500);
			} finally {
				client.release();
			}
		}
	}
}

/**
 *@swagger
 *components:
 *  responses:
 *      UserLinkedToEstablishment:
 *          description: L'utilisateur a été lié à l'établissement
 *      LinkUserBadRequest:
 *          description: L'id du l'utilisateur et de l'établissement doivent être définis
 *  requestBodies:
 *      UserToLink:
 *          description : Utilisateur à lier à un établissement
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: integer
 *                          establishmentId:
 *                              type: integer
 *                      required:
 *                          - userId
 *                          - establishmentId
 */

module.exports.linkUserToEstablishment = async (req, res) => {
	const { userId, establishmentId } = req.body;

	if (!numericValues(userId, establishmentId))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const updatedRows = await Person.linkToEstablishment(client, userId, establishmentId);

			res.sendStatus(updatedRows.count !== 0 ? 204 : 404);
			await client.query("COMMIT");
		} catch (e) {
			console.log(e);

			await client.query("ROLLBACK");
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
 *      UserUnlinkedFromEstablishment:
 *          description: L'utilisateur a été délié de l'établissement
 *      UnlinkUserBadRequest:
 *          description: L'id du l'utilisateur et de l'établissement doivent être définis
 *  requestBodies:
 *      UserToUnlink:
 *          description : Utilisateur à détacher d'un établissement
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: integer
 *                          establishmentId:
 *                              type: integer
 *                      required:
 *                          - userId
 *                          - establishmentId
 */

module.exports.unlinkUserFromEstablishment = async (req, res) => {
	const { userId, establishmentId } = req.body;

	if (!numericValues(userId, establishmentId)) {
		res.sendStatus(400);
	} else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const updatedRows = await Person.unlinkFromEstablishment(client, userId, establishmentId);

			res.sendStatus(updatedRows.rowCount !== 0 ? 204 : 404);
			await client.query("COMMIT");
		} catch (e) {
			console.log(e);

			await client.query("ROLLBACK");
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
 *      PasswordUpdated:
 *          description: Le mot de passe a été modifié
 *      UpdatePasswordBadRequest:
 *          description: Le nom d'utilisateur, l'ancien et le nouveau mot de passe doivent être définis
 *      UpdatePasswordUnauthorized:
 *          description: L'ancien mot de passe n'est pas correct
 *  requestBodies:
 *      PasswordToUpdate:
 *          description : Mot de passe à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: integer
 *                          currentPassword:
 *                              type: string
 *                              format: password
 *                          newPassword:
 *                              type: string
 *                              format: password
 *                      required:
 *                          - newPassword
 */

module.exports.updatePassword = async (req, res) => {
	const { newPassword } = req.body;
	let { username, currentPassword } = req.body;

	if (!allDefined(newPassword))
		res.sendStatus(400);
	else {
		if (
			((username !== undefined && username !== req.session.username)
				|| (currentPassword !== undefined && await matchPasswords(currentPassword, req.session.password)))
			&& req.session.authLevels.filter(authLevel => authLevel.accessLevel !== "admin").size === 1
		)
			res.sendStatus(403);
		else {
			username = username !== undefined ? username : req.session.username;
			currentPassword = currentPassword !== undefined ? currentPassword : req.session.password;

			const client = await pool.connect();

			try {
				await client.query("BEGIN");

				const user = await Person.getPersonByUsername(client, username);
				if(user != undefined){
					if (await matchPasswords(currentPassword, user.password)) {
						const updatedRows = await Person.updatePassword(client, user.id, await getPasswordHash(newPassword));

						res.sendStatus(updatedRows.rowCount !== 0 ? 204 : 404);

						await client.query("COMMIT");
					} else {
						await client.query("ROLLBACK");

						res.sendStatus(401);
					}
				} else
					res.sendStatus(404);


			} catch (e) {
				console.log(e);

				await client.query("ROLLBACK");
				res.sendStatus(500);
			} finally {
				client.release();
			}
		}
	}
}
