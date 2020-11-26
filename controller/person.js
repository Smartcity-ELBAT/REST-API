const Address = require("../model/address");
const Person = require("../model/person");
const pool = require("../model/database");
const {numericValues} = require("../utils/values");
const {getPasswordHash} = require("../utils/passwords");
const { allDefined } = require("../utils/values");
const { matchPasswords } = require("../utils/passwords");

module.exports.getUser = async (req, res) => {
	const username = req.params.username;

	if (username !== undefined)
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByUsername(client, username);

			if (user !== undefined) {
				const userToSend = {
					id: user.id,
					username: user.username,
					password: user.password,
					lastName: user.lastName,
					firstName: user.firstName,
					birthDate: new Date(user.birthDate),
					gender: user.gender,
					phoneNumber: user.phoneNumber,
					email: user.email,
					address: {
						id: user.addressId,
						street: user.street,
						number: user.number,
						city: user.city,
						postalCode: user.postalCode,
						country: user.country
					}
				};

				res.json(userToSend);
			} else res.sendStatus(404);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

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

module.exports.addUser = async (req, res) => {
	const {
		username,
		password,
		lastName,
		firstName,
		birthDate,
		gender,
		phoneNumber,
		email,
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
				phoneNumber,
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

module.exports.updateUser = async (req, res) => {
	const { id, firstName, lastName, birthDate, gender, phoneNumber, email } = req.body
	const { addressId, street, number, postalCode, city, country } = req.body.address;

	if (!allDefined(lastName, firstName, birthDate, gender, phoneNumber, email, street, number, country, city, postalCode)
	|| !numericValues(id, addressId))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");
			await Address.updateAddress(client, addressId, street, number, country, city, postalCode);

			res.sendStatus(
				// TODO pas undefined mais rowCount === 0 -> 404
				await Person.updatePersonalInfo(client, id, firstName, lastName, birthDate, gender, phoneNumber, email) !== undefined ?
					200 : 404
			);

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			console.log(error);
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

module.exports.linkUserToEstablishment = async (req, res) => {
	const { userId, establishmentId } = req.body;

	if (!numericValues(userId, establishmentId))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await Person.linkToEstablishment(client, userId, establishmentId);
		} catch (error) {
			console.log(error);
			res.sendStatus(404);
		} finally {
			client.release();
		}
	}
}

module.exports.updatePassword = async (req, res) => {
	const { userId: username, currentPassword, newPassword } = req.body;

	if (!allDefined(username, currentPassword, newPassword)) res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByUsername(client, username);

			if (matchPasswords(currentPassword, user.password))
				await Person.updatePassword(client, user.id, getPasswordHash(newPassword));
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}
