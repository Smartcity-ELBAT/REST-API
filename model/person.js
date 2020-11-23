module.exports.addPerson = async (client, username, password, lastName, firstName, birthDate, gender, phoneNumber, email, isWaiter, addressId) => {
	return client.query(`
        INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, address_id)
        VALUES ($1, $2, $3, $4, to_date($5, 'DD/MM/YYYY'), $6, $7, $8, $9) RETURNING *;
	`, [username, password, lastName, firstName, birthDate, gender, phoneNumber, email, addressId]
	).then(value => {
		client.query(`
            INSERT INTO user_access_level (user_id, access_level)
            VALUES ($1, $2);
		`, [value.rows[0].id, "customer"])
	});
}

module.exports.getPersonByUsername = async (client, username) => {
	return (await client.query(`
		SELECT person.id, username, password, last_name AS "lastName", first_name AS "firstName",
		       birth_date AT TIME ZONE 'Europe/Brussels' AS "birthDate", gender, phone_number AS "phoneNumber", email,
		       address.id AS "addressId", street, number, country, locality_city AS city,
		       postal_code AS "postalCode", al.access_level AS "accessLevel", establishment_id AS "establishmentId"
		FROM person
		LEFT OUTER JOIN address ON person.address_id = address.id
		LEFT OUTER JOIN user_access_level ual ON person.id = ual.user_id
		LEFT OUTER JOIN access_level al ON ual.access_level = al.access_level
		WHERE username = $1;
	`, [ username ])).rows[0];
}

module.exports.getAllUsers = async (client) => {
	return await client.query(`
		SELECT * FROM person;
	`);
}

module.exports.updatePersonalInfo = async (client, id, firstName, lastName, birthDate, gender, phoneNumber, email) => {
	return await client.query(`
		UPDATE person SET last_name = $1, first_name = $2, birth_date = $3, gender = $4, phone_number = $5, email = $6 WHERE id = $7
	`, [ firstName, lastName, birthDate, gender, phoneNumber, email, id ]);
}

module.exports.updatePassword = async (client, id, password) => {
	return await client.query(`
		UPDATE person SET password = $1 WHERE id = $2;
	`, [ password, id ]);
}

module.exports.linkToEstablishment = async (client, userId, establishmentId) => {
	return await client.query(`
		INSERT INTO user_access_level (user_id, access_level) VALUES ($1, $2);
	`, [ userId, "waiter_E" + establishmentId ]);
}