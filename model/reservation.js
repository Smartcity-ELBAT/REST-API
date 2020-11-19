
// TODO dateTimeReserved arrive en string et est converti en timestamp ici  --> format YYYY-MM-DD HH24:MI

// Android
module.exports.getClientReservations = async (client, idPerson) => {
    return client.query("SELECT * FROM reservation WHERE person_id = $1", [idPerson]);
}

// React
module.exports.getDayReservations = async (client, dateTimeReserved) => {
    return client.query("SELECT * FROM reservation WHERE date_time_reserved = to_timestamp($1, 'YYYY-MM-DD HH24:MI')", [dateTimeReserved]);
}

module.exports.addReservation = async (client, idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment) => {
    // TODO voir si format timestamp OK ou pas
    const text = "INSERT INTO reservation (person_id, date_time_reserved, customers_nbr, table_id, establishment_id) VALUES ($1, to_timestamp($2, 'YYYY-MM-DD HH24:MI'), $3, $4, $5)";
    const values = [idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment];
    return client.query(text, values);
}

module.exports.updateAdditionalInformation = async (client, idPerson, dateTimeReserved, additionnalInformation) => {
    const text = "UPDATE reservation SET additional_info = $1 WHERE person_id = $2 AND date_time_reserved = $3";
    const values = [additionnalInformation, idPerson, dateTimeReserved];
    return client.query(text, values);
}

module.exports.updateReservation = async (client, idPerson, dateTimeReserved, nbCustomers, additionnalInformation, idTable, idEstablishment) => {
    let text = "UPDATE reservation SET date_time_reserved = $1, customers_nbr = $2, table_id = $3, establishment_id = $4";
    let values = [dateTimeReserved, nbCustomers, idTable, idEstablishment];

    if(additionnalInformation !== undefined){
        values.push(additionnalInformation);
        text += ", additional_info = $" + values.length;
    }

    values.push(idPerson);
    text += " WHERE person_id =  $" + values.length;

    values.push(dateTimeReserved);
    text += " AND date_time_reserved = $" + values.length;

    return client.query(text, values);
}

module.exports.updateArrivingTime = async (client, idPerson, dateTimeReserved, arrivingTime) => {
    const text = "UPDATE reservation SET arriving_time = $1, is_cancelled = $2 WHERE person_id = $3 AND date_time_reserved = $4";
    const values = [arrivingTime, false, idPerson, dateTimeReserved];
    return client.query(text, values);
}

module.exports.updateExitTime = async (client, idPerson, dateTimeReserved, exitTime) => {
    const text = "UPDATE reservation SET exit_time = $1 WHERE person_id = $2 AND date_time_reserved = $3";
    const values = [exitTime, idPerson, dateTimeReserved];
    return client.query(text, values);
}

module.exports.cancelReservation = async (client, idPerson, dateTimeReserved) => {
    const text = "UPDATE reservation SET is_cancelled = $1 WHERE person_id = $2 AND date_time_reserved = $3";
    const values = [true, idPerson, dateTimeReserved];
    return client.query(text, values);
}