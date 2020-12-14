const pool = require ("../model/database");
const Address = require("../model/address");
const Establishment = require("../model/establishment");
const { allDefined, numericValues } = require("../utils/values");

/**
 *@swagger
 *components:
 *  responses:
 *      EstablishmentUpdated:
 *          description: L'établissement a été modifié
 *      UpdateEstablishmentBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      EstablishmentToUpdate:
 *          description : Etablissement à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          name:
 *                              type: string
 *                          phoneNumber:
 *                              type: string
 *                          VATNumber:
 *                              type: string
 *                          email:
 *                              type: string
 *                          category:
 *                              type: string
 *                          addressId:
 *                              type: integer
 *                          street:
 *                             type: string
 *                          number:
 *                              type: string
 *                          country:
 *                              type: string
 *                          city:
 *                              type: string
 *                          postalCode:
 *                              type: string
 *                      required:
 *                          - id
 *                          - name
 *                          - phoneNumber
 *                          - VATNumber
 *                          - email
 *                          - category
 *                          - addressId
 *                          - street
 *                          - number
 *                          - country
 *                          - city
 *                          - postalCode
 */

module.exports.patchEstablishment = async (req, res) => {
	const { id, name, phoneNumber, VATNumber, email, category, addressId, street, number, city, postalCode, country } = req.body;

	if (!allDefined(name, phoneNumber, VATNumber, email, category, street, number, city, postalCode, country)
		|| !numericValues(id, addressId))
		res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const updatedAddressRows = await Address.updateAddress(client, addressId, street, number, city, postalCode, country);

			if (updatedAddressRows.rowCount !== 0) {
				const updatedEstablishmentRows = await Establishment.updateEstablishment(client, id, name, phoneNumber.replace(/\/?\.?-?/, ""), VATNumber, email, category);

				res.sendStatus(updatedEstablishmentRows !== 0 ? 204 : 404);
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

/**
 *@swagger
 *components:
 *  responses:
 *      EstablishmentDeleted:
 *          description: L'établissement a été supprimé ainsi que toutes ses tables, ses réversations et ses liens avec les employés
 *      DeleteEstablishmentBadRequest:
 *          description: L'id de l'établissement doit être définit
 *  requestBodies:
 *      EstablishmentToDelete:
 *          description : Etablissement à supprimer
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          idEstablishment:
 *                              type: integer
 *                      required:
 *                          - idEstablishment

 */

module.exports.deleteEstablishment = async (req, res) => {
	const { establishmentId } = req.body;

	if (isNaN(establishmentId))
    res.sendStatus(400);
	else {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			const deletedRows = await Establishment.deleteEstablishment(client, establishmentId);
			res.sendStatus(deletedRows.rowCount !== 0 ? 204 : 404);

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Establishment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type : string
 *         phone_number:
 *           type: string
 *         vat_number:
 *           type: string
 *         email:
 *           type: string
 *         category:
 *           type: string
 *         adresse:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             street:
 *               type: string
 *             number:
 *               type: string
 *             country:
 *               type: string
 *             locality:
 *               type: object
 *               properties:
 *                city:
 *                  type: string
 *                postal_code:
 *                  type: string
 */

/**
 *@swagger
 *components:
 *  responses:
 *      EstablishmentFound:
 *          description: Renvoie un établissement
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Establishment'
 *      EstablishmentRetrievedBadRequest:
 *          description: L'id de l'établissement doit être définis
 */

module.exports.getEstablishment = async (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            // récup en 2 étape sinon on récup plein d'infos en plus des establishments
            const {rows : establishments} = await Establishment.getEstablishment(client, id);
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

/**
 *@swagger
 *components:
 *  responses:
 *      ArrayOfEstablishments:
 *          description: Renvoie tous les établissements
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Establishment'
 */

module.exports.getAllEstablishments = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows : establishments } = await Establishment.getAllEstablishments(client);
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

/**
 *@swagger
 *components:
 *  responses:
 *      EstablishmentAdded:
 *          description: L'établissement a été ajouté et son id est renvoyé
 *      AddEstablishmentBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      EstablishmentToAdd:
 *          description : Etablissement à ajouter
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          phoneNumber:
 *                              type: string
 *                          VATNumber:
 *                              type: string
 *                          email:
 *                              type: string
 *                          category:
 *                              type: string
 *                          street:
 *                             type: string
 *                          number:
 *                              type: string
 *                          country:
 *                              type: string
 *                          city:
 *                              type: string
 *                          postalCode:
 *                              type: string
 *                      required:
 *                          - name
 *                          - phoneNumber
 *                          - VATNumber
 *                          - email
 *                          - category
 *                          - street
 *                          - number
 *                          - country
 *                          - city
 *                          - postalCode
 */

module.exports.addEstablishment = async (req, res) => {
    const {name, phoneNumber, VATNumber, email, category, street, number, country, city, postalCode} = req.body;

    if (!allDefined(name, phoneNumber, VATNumber, email, category, street, number, country, city, postalCode)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const idAddress = await Address.addAddress(client, street, number, country, city, postalCode);
            const idEstablishment = await Establishment.addEstablishment(client, name, phoneNumber.replace(/\/?\.?-?/, ""), VATNumber, email, category, idAddress);

            await client.query("COMMIT");
            res.json(idEstablishment);
        } catch (error) {
            await client.query("ROLLBACK");

            console.log(error);
          
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}