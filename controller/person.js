const Address = require("../model/address");
const Person = require("../model/person");
const pool = require("../model/database");
const { allDefined } = require("../utils/values");
const { matchPasswords } = require("../utils/passwords");

module.exports.getUser = async (req, res) => {
	const username = req.params.username;

	if (!allDefined(username)) res.sendStatus(400);
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
		} catch (e) {
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

module.exports.getAllUsers = async (req, res) => {
	const client = await pool.connect();

	try {
		const { rows: users } = Person.getAllUsers(client);

		if (users === undefined) res.sendStatus(404);
		else {
			res.json(users);
		}
	} catch (e) {
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
		isWaiter
	} = req.body;
	const {
		street,
		number,
		country,
		city,
		postalCode
	} = req.body.address;

	if (!allDefined(username, password, lastName, firstName, birthDate, gender, phoneNumber, email, street, number, country, city, postalCode))
		res.sendStatus(404);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const addressId = await Address.addAddress(client, street, number, country, city, postalCode);
			await Person.addPerson(
				client,
				username,
				await getPasswordHash(password),
				lastName,
				firstName,
				birthDate,
				gender,
				phoneNumber,
				email,
				isWaiter,
				addressId
			);

			await client.query("COMMIT");
			res.sendStatus(201);
		} catch (e) {
			await client.query("ROLLBACK");
			console.log(e);
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

module.exports.updateUser = async (req, res) => {
	const { id, firstName, lastName, birthDate, gender, phoneNumber, email } = req.body
	const { addressId, street, number, postalCode, city, country } = req.body.address;

	if (!allDefined(id, lastName, firstName, birthDate, gender, phoneNumber, email, addressId, street, number, country, city, postalCode))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");
			await Address.updateAddress(client, addressId, street, number, country, city, postalCode);

			res.sendStatus(
				await Person.updatePersonalInfo(client, id, firstName, lastName, birthDate, gender, phoneNumber, email) !== undefined ?
					200 : 404
			);

			await client.query("COMMIT");
		} catch (e) {
			await client.query("ROLLBACK");
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

module.exports.linkUserToEstablishment = async (req, res) => {
	const { userId, establishmentId } = req.body;

	if (!allDefined(userId, establishmentId)) res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await Person.linkEmployeeToEstablishment(client, userId, establishmentId);
		} catch (e) {
			res.sendStatus(404);
		} finally {
			client.release();
		}
	}
}

// TODO: ce serait mieux de traiter ça en session utilisateur
module.exports.updatePassword = async (req, res) => {
	const { userId: username, currentPassword, newPassword } = req.body;

	if (!allDefined(username, currentPassword, newPassword)) res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByUsername(client, username);

			if (matchPasswords(currentPassword, user.password))
				await Person.updatePassword(client, user.id, getPasswordHash(newPassword));
		} catch (e) {
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}
