module.exports.getEstablishment = async (client, id) => {
    return await client.query("SELECT * FROM establishment e join address a on e.address_id = a.id join locality l on l.city = a.locality_city and l.postal_code = a.postal_code WHERE e.id = $1", [id]);
}

module.exports.getAllEstablishments = async (client) => {
    return await client.query("SELECT * FROM establishment e join address a on e.address_id = a.id join locality l on l.city = a.locality_city and l.postal_code = a.postal_code");
}

module.exports.addEstablishment = async (client, name, phoneNumber, TVANumber, email, category, idAddress) => {
    const text = `INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [name, phoneNumber, TVANumber, email, category, idAddress];
    return await client.query(text, values);
}

module.exports.updateEstablishment =  async (client, id, name, phoneNumber, VATNumber, email, category) => {
	return await client.query(`
		UPDATE establishment SET name = $1, phone_number = $2, vat_number = $3, email = $4, category = $5 WHERE id = $6;
	`, [ name, phoneNumber, VATNumber, email, category, id ]);
}

module.exports.deleteEstablishment = async (client, id, accessLevelKey) => {
	return await client.query(`
			DELETE FROM user_access_level WHERE access_level = $1
		`, [ accessLevelKey ])
			.then(
				await client.query(`
					DELETE FROM access_level WHERE access_level.access_level = $1
				`, [ accessLevelKey ])
          .then(
            await client.query(`
              DELETE FROM reservation WHERE establishment_id = $1
            `, [ id ])
              .then(
                await client.query(`
                  DELETE FROM table WHERE establishment_id = $1
                `, [ id ])
                .then(
                  await client.query(`
                    DELETE FROM establishment WHERE id = $1;
                  `, [ id ])
					  )
			);
}