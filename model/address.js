module.exports.getAddress = async (client, id) => {
	return await client.query(`
		SELECT * FROM address where id = $1;
	`, [ id ]);
}

module.exports.addAddress = async (client, street, number, country, city, postalCode) => {
	await insertLocality(client, city, postalCode);

	await Promise.all([await client.query(`
        INSERT INTO address (street, number, country, locality_city, postal_code)
        VALUES ($1, $2, $3, $4, $5);
	`, [ street, number, country, city, postalCode ])]);

	return (await client.query(`
		SELECT id, LAST_VALUE (id) OVER(ORDER BY id DESC) id FROM address;
	`)).rows[0].id;
}

module.exports.updateAddress = async (client, id, street, number, country, city, postalCode) => {
	await insertLocality(client, city, postalCode);

	return await client.query(`
		UPDATE address SET street = $1, number = $2, country = $3, locality_city = $4, postal_code = $5 where id = $6
	`, [ street, number, country, city, postalCode, id ]);
}

insertLocality = async (client, city, postalCode) => {
	await Promise.all([await client.query(`
		INSERT INTO locality (city, postal_code) VALUES ($1, $2) ON CONFLICT DO NOTHING;
	`, [ city, postalCode ])]);
}