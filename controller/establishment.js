const pool = require ("../model/database");
const Address = require("../model/address");
const Establishment = require("../model/establishment");
const { allDefined } = require("../utils/values");

// TODO: réfléchir à la partie tables à insérer (peut-être ancien count des tables et nouveau)
module.exports.patch = async (req, res) => {
	const { id, name, phoneNumber, VATNumber, email, category } = req.body;
	const { id: addressId, street, number, city, postalCode, country } = req.body.address;

	if (!allDefined(id, name, phoneNumber, VATNumber, email, category))
		res.sendStatus(404);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			await Address.updateAddress(client, addressId, street, number, city, postalCode, country);
			await Establishment.update(client, id, name, phoneNumber, VATNumber, email, category);

			await client.query("COMMIT");
		} catch (e) {
			await client.query("ROLLBACK");
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

module.exports.delete = async (req, res) => {
	const { establishmentId, accessLevelKey } = req.body;

	if (!allDefined(establishmentId, accessLevelKey)) res.sendStatus(404);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			await Establishment.delete(client, establishmentId, accessLevelKey);

			await client.query("COMMIT");
		} catch (e) {
			await client.query("ROLLBACK");
			res.sendStatus(500);
		} finally {
			client.release();
		}

	}
}