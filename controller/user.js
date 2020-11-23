const jwt = require("jsonwebtoken");
const { matchPasswords } = require("../utils/passwords");
const { allDefined } = require("../utils/values");
const pool = require("../model/database");
const Person = require("../model/person");


module.exports.login = async (req, res) => {
	const { username, password } = req.body;

	if (!allDefined(username, password)) res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			const user = await Person.getPersonByUsername(client, username);

			if (user === undefined || !await matchPasswords(password, user.password)) res.sendStatus(404)
			else {
				const payload = {
					accessLevel: user.accessLevel !== null ? user.accessLevel : "client",
					establishment: user.establishmentId !== null ? user.establishmentId : undefined,
					userData: {
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
							street: user.street,
							number: user.number,
							city: user.city,
							postalCode: user.postalCode,
							country: user.country
						}
					}
				}

				res.json(await jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "24h"}));
			}
		} catch (e) {
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}
