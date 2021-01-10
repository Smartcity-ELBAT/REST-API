module.exports.updatePositiveToCovid = async(client, userId) => {
	return client.query(`UPDATE person SET is_positive_to_covid_19 = true WHERE id = $1`, [userId]);
}

module.exports.addPerson = async (client, username, password, lastName, firstName, birthDate, gender, phoneNumber, email, addressId) => {
	return client.query(`
        INSERT INTO person (username, password, last_name, first_name, birth_date, gender, phone_number, email, address_id, is_positive_to_covid_19)
        VALUES ($1, $2, $3, $4, to_date($5, 'DD/MM/YYYY'), $6, $7, $8, $9, false) RETURNING *;
	`, [username, password, lastName, firstName, birthDate, gender, phoneNumber, email, addressId]
	).then(async (value) => {
		await client.query(`
            INSERT INTO user_access_level (user_id, access_level)
            VALUES ($1, $2);
		`, [value.rows[0].id, "customer"]);
	});
}

// Android
module.exports.getUserById = async (client, id) => {
	return (await client.query(`
		SELECT person.id, username, password, last_name AS "lastName", first_name AS "firstName",
		       birth_date AT TIME ZONE 'Europe/Brussels' AS "birthDate", gender, phone_number AS "phoneNumber", email,
		       address.id AS "addressId", street, number, country, locality_city AS city,
		       postal_code AS "postalCode"
		FROM person
		JOIN address ON person.address_id = address.id
		WHERE person.id = $1;
	`, [ id ])).rows[0];
}

module.exports.getPersonByUsername = async (client, username) => {
	return (await client.query(`
		SELECT person.id, username, password, last_name AS "lastName", first_name AS "firstName",
		       birth_date AT TIME ZONE 'Europe/Brussels' AS "birthDate", gender, phone_number AS "phoneNumber", email,
		       address.id AS "addressId", street, number, country, locality_city AS city,
		       postal_code AS "postalCode"
		FROM person
		JOIN address ON person.address_id = address.id
		WHERE username = $1;
	`, [ username ])).rows[0];
}

module.exports.getPersonByPhoneNumber = async (client, phoneNumber) => {
	return (await client.query(`
		SELECT person.id, username, password, last_name AS "lastName", first_name AS "firstName",
		       birth_date AT TIME ZONE 'Europe/Brussels' AS "birthDate", gender, phone_number AS "phoneNumber", email,
		       address.id AS "addressId", street, number, country, locality_city AS city,
		       postal_code AS "postalCode"
		FROM person
		JOIN address ON person.address_id = address.id
		WHERE phone_number = $1;
	`, [ phoneNumber ])).rows[0];
}

module.exports.getUsersByEstablishmentId = async (client, establishmentId) => {
	return await client.query(`
		SELECT person.id, username, password, last_name AS "lastName", first_name AS "firstName",
               birth_date AT TIME ZONE 'Europe/Brussels' AS "birthDate", gender, phone_number AS "phoneNumber", email,
               address.id AS "addressId", street, number, country, locality_city AS city,
               postal_code AS "postalCode"
		FROM person
		JOIN address on person.address_id = address.id
		JOIN user_access_level ual on person.id = ual.user_id
		WHERE access_level = $1;
	`, [`waiter_E` + establishmentId]);
}

module.exports.getAllUsers = async (client) => {
	return await client.query(`
		SELECT person.id, username, password, last_name AS "lastName", first_name AS "firstName",
               birth_date AT TIME ZONE 'Europe/Brussels' AS "birthDate", gender, phone_number AS "phoneNumber", email, address_id AS "addressId" FROM person;
	`);
}

// TODO ajout to_date pour birthDate
module.exports.updatePersonalInfo = async (client, id, firstName, lastName, birthDate, gender, phoneNumber) => {
	return await client.query(`
		UPDATE person SET last_name = $1, first_name = $2, birth_date = to_date($3, 'DD/MM/YYYY'), gender = $4, phone_number = $5 WHERE id = $6;
	`, [ firstName, lastName, birthDate, gender, phoneNumber, id ]);
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

module.exports.unlinkFromEstablishment = async (client, userId, establishmentId) => {
	return await client.query(`
		DELETE FROM user_access_level WHERE user_id = $1 AND access_level = $2;
	`, [ userId, "waiter_E" + establishmentId ]);
}