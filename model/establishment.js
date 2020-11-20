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
