module.exports.getUserAccessLevels = async (client, userId) => {
	return await client.query(`
		SELECT al.access_level AS "accessLevel", al.establishment_id AS "establishmentId"
		FROM access_level al
		JOIN user_access_level ual ON ual.access_level = al.access_level
		where ual.user_id = $1;
	`, [ userId ]);
}