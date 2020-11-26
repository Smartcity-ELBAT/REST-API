const pool = require ("../model/database");
const Address = require("../model/address");
const Establishment = require("../model/establishment");
const { allDefined, numericValues } = require("../utils/values");

// TODO: réfléchir à la partie tables à insérer (peut-être ancien count des tables et nouveau)
module.exports.patchEstablishment = async (req, res) => {
	const { id, name, phoneNumber, VATNumber, email, category } = req.body;
	const { id: addressId, street, number, city, postalCode, country } = req.body.address;

	if (!allDefined(name, phoneNumber, VATNumber, email, category, street, number, city, postalCode, country)
		|| !numericValues(id, addressId))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const updatedAddressRows = await Address.updateAddress(client, addressId, street, number, city, postalCode, country);

			if (updatedAddressRows.rowCount !== 0) {
				const updatedEstablishmentRows = await Establishment.updateEstablishment(client, id, name, phoneNumber, VATNumber, email, category);

				res.sendStatus(updatedEstablishmentRows !== 0 ? 200 : 404);
			  await client.query("COMMIT");
      } else {
				res.sendStatus(404);
        await client.query("ROLLBACK");
      }
			
		} catch (error) {
			await client.query("ROLLBACK");
            console.log(error);
			res.sendStatus(500);
		} finally {
			client.release();
		}
	}
}

module.exports.deleteEstablishment = async (req, res) => {
	const { establishmentId } = req.body;

	if (isNaN(establishmentId))
    res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const updatedRows = await Establishment.deleteEstablishment(client, establishmentId);
			res.sendStatus(updatedRows.rowCount !== 0 ? 200 : 404);

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

module.exports.getEstablishment = async (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            // récup en 2 étape sinon on récup plein d'infos en plus des establishments
            const {rows : establishments} = await EstablishmentModel.getEstablishment(client, id);
            const establishment = establishments[0];

            if(establishment !== undefined)
                res.json(establishment);
            else
                res.sendStatus(404);
        } catch(error) {
            console.log(error);
          
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getAllEstablishments = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows : establishments } = await EstablishmentModel.getAllEstablishments(client);
        if(establishments.length !== 0) {
            res.json(establishments);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
	    console.log(error);
      
      res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.addEstablishment = async (req, res) => {
    const {name, phoneNumber, VATNumber, email, category} = req.body;
    const {street, number, country, city, postalCode} = req.body.address;

    if (!allDefined(name, phoneNumber, VATNumber, email, category, street, number, country, city, postalCode)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const idAddress = await Address.addAddress(client, street, number, country, city, postalCode);
            await Establishment.addEstablishment(client, name, phoneNumber, VATNumber, email, category, idAddress);

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