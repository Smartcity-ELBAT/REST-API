// TODO peut être récup les adresses liées aux établissements

module.exports.getEstablishment = async (client, id) => {
    return await client.query("SELECT * FROM establishment WHERE id = $1", [id]);
}

module.exports.getAllEstablishments = async (client) => {
    return await client.query("SELECT * FROM establishment");
}

module.exports.addEstablishment = async (client, name, phoneNumber, TVANumber, email, category, idAddress) => {
    const text = `INSERT INTO establishment (name, phone_number, vat_number, email, category, address_id) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [name, phoneNumber, TVANumber, email, category, idAddress];
    return await client.query(text, values);
}
