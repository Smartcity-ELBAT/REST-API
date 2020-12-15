module.exports.getEstablishment = async (client, id) => {
    return await client.query(`SELECT
								   e.id,
								   e.name,
								   e.phone_number AS "phoneNumber",
								   e.vat_number AS "VATNumber",
								   e.email,
								   e.category,
								   e.address_id AS "addressId",
								   a.street,
								   a.number,
								   a.country,
								   l.city, 
       							   l.postal_code AS "postalCode" 
								FROM establishment e 
								    join address a on e.address_id = a.id 
								    join locality l on l.city = a.locality_city and l.postal_code = a.postal_code 
								WHERE e.id = $1`, [id]);
}

module.exports.getAllEstablishments = async (client) => {
    return await client.query(`SELECT
								   e.id,
								   e.name,
								   e.phone_number AS "phoneNumber",
								   e.vat_number AS "VATNumber",
								   e.email,
								   e.category,
								   e.address_id AS "addressId",
								   a.street,
								   a.number,
								   a.country,
								   l.city,
								   l.postal_code AS "postalCode"
							   FROM establishment e
										join address a on e.address_id = a.id
										join locality l on l.city = a.locality_city and l.postal_code = a.postal_code`);
}

module.exports.addEstablishment = async (client, name, phoneNumber, VATNumber, email, category, idAddress) => {
    const text = `INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [name, phoneNumber, VATNumber, email, category, idAddress];

    await client.query(text, values)
	    .then(async (value) => {
	    	await client.query(`INSERT INTO access_level (access_level, establishment_id) VALUES ($1, $2);`,
		    [ "waiter_E" + value.rows[0].id, value.rows[0].id ])
	    });

	return (await client.query(`
		SELECT id, LAST_VALUE (id) OVER(ORDER BY id DESC) id FROM establishment;
	`)).rows[0].id;
}

module.exports.updateEstablishment =  async (client, id, name, phoneNumber, VATNumber, email, category) => {
	return await client.query(`
		UPDATE establishment SET name = $1, phone_number = $2, vat_number = $3, email = $4, category = $5 WHERE id = $6;
	`, [ name, phoneNumber, VATNumber, email, category, id ]);
}

module.exports.deleteEstablishment = async (client, id) => {
	// return await client.query(`
	// 		DELETE FROM user_access_level WHERE access_level = $1
	// 	`, [ "waiter_E" + id ])
	// 		.then(
	// 			await client.query(`
	// 				DELETE FROM access_level WHERE access_level.access_level = $1
	// 			`, [ "waiter_E" + id ])
	// 		).then(
	// 			await client.query(`
	// 				DELETE FROM reservation WHERE establishment_id = $1
    //             `, [ id ])
	// 		).then(
	// 			await client.query(`
	// 				DELETE FROM "table" WHERE establishment_id = $1
    //             `, [ id ])
	// 		).then(
	// 			await client.query(`
	// 				DELETE FROM establishment WHERE id = $1 RETURNING *;
	// 			`, [ id ])
	// 		);

		return await client.query(`
					DELETE FROM establishment WHERE id = $1 RETURNING *;
	 			`, [ id ])
}