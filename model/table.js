module.exports.getAllTables = async (client, idEstablishment) => {
    return await client.query('SELECT * FROM "table" WHERE establishment_id = $1', [idEstablishment]);
}

module.exports.getTable = async (client, idTable, idEstablishment) => {
    return await client.query('SELECT * FROM "table" WHERE  establishment_id = $1 AND id = $2', [idEstablishment, idTable]);
}

module.exports.addTable = async (client, idEstablishment, nbSeats, isOuside) => {
    const text = 'INSERT INTO "table" (establishment_id, seats_nbr, is_outside) VALUES ($1, $2, $3)';
    const values = [idEstablishment, nbSeats, isOuside];
    return await client.query(text, values);
}

module.exports.updateTable = async (client, idTable, idEstablishment, isOuside) => {
    const text = 'UPDATE "table" SET is_outside = $1 WHERE id = $2 AND establishment_id = $3';
    const values = [isOuside, idTable, idEstablishment];
    return await client.query(text, values);
}

module.exports.deleteTable = async (client, idTable, idEstablishment) => {
    return await client.query('DELETE FROM "table" WHERE id = $1 AND establishment_id = $2', [idTable, idEstablishment]);
}