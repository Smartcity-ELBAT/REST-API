module.exports.update =  async (client, id, name, phoneNumber, VATNumber, email, category) => {
	return await client.query(`
		UPDATE establishment SET name = $1, phone_number = $2, vat_number = $3, email = $4, category = $5 WHERE id = $6;
	`, [ name, phoneNumber, VATNumber, email, category, id]);
}

module.exports.delete = async (client, id, accessLevelKey) => {
	return await client.query(`
			DELETE FROM user_access_level WHERE access_level = $1
		`, [ accessLevelKey ])
			.then(
				await client.query(`
					DELETE FROM access_level WHERE access_level.access_level = $1
				`, [ accessLevelKey ])
					.then(
						await client.query(`
							DELETE FROM establishment WHERE id = $1;
						`, [ id ])
					)
			);
}