const jwt = require("jsonwebtoken");
const { matchPasswords } = require("../utils/passwords");
const { allDefined } = require("../utils/values");
const pool = require("../model/database");
const Person = require("../model/person");
const AccessLevel = require("../model/accessLevel");

/**
 * @swagger
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 *                  format: password
 *          required:
 *              - username
 *              - password
 */

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
						addressId: user.addressId,
					}
				}
				const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "14h"});
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
