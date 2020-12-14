const Address = require("../model/address");
const Person = require("../model/person");
const pool = require("../model/database");
const { getPasswordHash, matchPasswords } = require("../utils/passwords");
const { allDefined, numericValues } = require("../utils/values");

module.exports.getUser = async (req, res) => {
	const username = req.params.username;

	if (username === undefined)
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByUsername(client, username.toLowerCase());

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

module.exports.getUsersByEstablishmentId = async (req, res) => {
	const establishmentId = req.params.establishmentId;

	if (establishmentId === undefined)
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const {rows: users} = await Person.getUsersByEstablishmentId(client, establishmentId);

			if (users !== undefined) res.json(users);
			else res.sendStatus(404);
		} catch (e) {
			console.log(e);
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

module.exports.updateUser = async (req, res) => {
	const { firstName, lastName, birthDate, gender, phoneNumber, email } = req.body
	const { street, number, postalCode, city, country } = req.body.address;
	let { id } = req.body;
	let { id: addressId } = req.body.address;

	if (!allDefined(lastName, firstName, birthDate, gender, phoneNumber, email, street, number, country, city, postalCode))
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
					const updatedUserRows = await Person.updatePersonalInfo(client, id, firstName, lastName, birthDate, gender, phoneNumber, email);

					await client.query("COMMIT");
					res.sendStatus(updatedUserRows.rowCount !== 0 ? 200 : 404);
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

module.exports.linkUserToEstablishment = async (req, res) => {
	const { userId, establishmentId } = req.body;

	if (!numericValues(userId, establishmentId))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const updatedRows = await Person.linkToEstablishment(client, userId, establishmentId);

			res.sendStatus(updatedRows.count !== 0 ? 200 : 404);
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

module.exports.unlinkUserFromEstablishment = async (req, res) => {
	const { userId, establishmentId } = req.body;

	if (!numericValues(userId, establishmentId)) {
		res.sendStatus(400);
	} else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const updatedRows = await Person.unlinkFromEstablishment(client, userId, establishmentId);

			res.sendStatus(updatedRows.rowCount !== 0 ? 200 : 404);
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

module.exports.updatePassword = async (req, res) => {
	const { newPassword } = req.body;
	let { username, currentPassword } = req.body;

	if (!allDefined(newPassword)) res.sendStatus(400);
	else {
		if (
			((username !== undefined && username !== req.session.username)
				|| (currentPassword !== undefined && currentPassword !== req.session.addressId))
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

				if (matchPasswords(currentPassword, user.password)) {
					const updatedRows = await Person.updatePassword(client, user.id, await getPasswordHash(newPassword));

					res.sendStatus(updatedRows.rowCount !== 0 ? 200 : 404);

					await client.query("COMMIT");
				} else {
					await client.query("ROLLBACK");

					res.sendStatus(401);
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
