const jwt = require("jsonwebtoken");
const { matchPasswords } = require("../utils/passwords");
const { allDefined } = require("../utils/values");
const pool = require("../model/database");
const Person = require("../model/person");
const AccessLevel = require("../model/accessLevel");

module.exports.login = async (req, res) => {
	const { username, password } = req.body;

	if (!allDefined(username, password))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByUsername(client, username.toLowerCase());

			if (user === undefined)
				res.sendStatus(404);
			else if (!await matchPasswords(password, user.password))
				res.sendStatus(401);
			else {
				const { rows: accessLevels } = await AccessLevel.getUserAccessLevels(client, user.id);
				const payload = {
					accessLevels: accessLevels,
					userData: {
						id: user.id,
						username: user.username,
						password: user.password,
						lastName: user.lastName,
						firstName: user.firstName,
						birthDate: user.birthDate,
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
					}
				}
				// TODO réfléchir à la durée du token, 24h me semble long
				const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "24h"});
				res.json(token);
			}
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}
