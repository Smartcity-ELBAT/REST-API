const pool = require('../model/database');
const EstablishmentModel = require('../model/establishment');
//const AddressModel = require('../model/address');

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
        if(establishments.length != 0) {
            res.json(establishments);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.addEstablishment = async (req, res) => {
    const {name, phoneNumber, TVANumber, email, category} = req.body;
    const {street, number, country, city, postalCode} = req.body.address;

    if(name === undefined || phoneNumber === undefined || TVANumber === undefined || email === undefined || category === undefined  ||
    street === undefined || isNaN(number) || country === undefined || city === undefined || postalCode === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            /*
            // TODO vérifier que ça fonctionne avec le code de Christophe
                (penser à retirer l'idAdress hardcodé ligne 63 et décommenter l'import d'adresse !!!)

            const idAddress = await AddressModel.addAddress(client, street, number, country, city, postalCode);
            await EstablishmentModel.addEstablishment(client, name, phoneNumber, TVANumber, email, category, idAddress);
             */
            await EstablishmentModel.addEstablishment(client, name, phoneNumber, TVANumber, email, category, 2);

            await client.query("COMMIT");
            res.sendStatus(201);

        } catch (error) {
            await client.query("ROLLBACK");
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}