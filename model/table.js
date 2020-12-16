module.exports.getAllTables = async (client, idEstablishment) => {
    return await client.query(`SELECT t.id AS "id", t.establishment_id AS "establishmentId", t.seats_nbr AS "nbSeats", t.is_outside AS "isOutside" 
        FROM "table" t WHERE establishment_id = $1`, [idEstablishment]);
}

module.exports.getTable = async (client, idTable, idEstablishment) => {
    return await client.query(`SELECT * FROM "table" WHERE  establishment_id = $1 AND id = $2`, [idEstablishment, idTable]);
}

module.exports.addTable = async (client, idEstablishment, nbSeats, isOuside) => {
    const text = `INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES ($1, $2, $3)`;
    const values = [idEstablishment, nbSeats, isOuside];
    return await client.query(text, values);
}

module.exports.deleteTable = async (client, idTable, idEstablishment) => {
    return await client.query(`DELETE FROM "table" WHERE id = $1 AND establishment_id = $2`, [idTable, idEstablishment]);
}

module.exports.getAllAvailableTables = async (client, establishmentId, chosenDate) => {
    return await client.query(`
        SELECT t.id AS "id", t.establishment_id AS "establishmentId", t.seats_nbr AS "nbSeats", t.is_outside AS "isOutside" 
        FROM "table" t
        WHERE establishment_id = $1 AND t.id NOT IN (
            SELECT id
            FROM "table" JOIN reservation r on "table".id = r.table_id and "table".establishment_id = r.establishment_id
            WHERE r.establishment_id = $1 AND date_time_reserved BETWEEN to_timestamp($2, 'YYYY-MM-DD HH24:MI:SS') AND to_timestamp($3, 'YYYY-MM-DD HH24:MI:SS')
        );
    `, [establishmentId, chosenDate + " 00:00:00", chosenDate + " 23:59:59"]);
}