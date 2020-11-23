
// TODO les dates arrivent en string et sont converties en timestamp ici
//  dateTimeReserved --> format YYYY-MM-DD HH24:MI
//  newDateTime --> format YYYY-MM-DD HH24:MI
//  arrivingTime --> format HH24:MI
//  exitTime --> format HH24:MI

// Android
module.exports.getClientReservations = async (client, idPerson) => {
    const text = "SELECT person_id, date_time_reserved at time zone 'Europe/Brussels', arriving_time, exit_time, customers_nbr, additional_info, is_cancelled, table_id, establishment_id FROM reservation WHERE person_id = $1";
    return client.query(text, [idPerson]);
}

// React
module.exports.getDayReservations = async (client, dateTimeReserved) => {
    const text = "SELECT * FROM reservation WHERE date_time_reserved BETWEEN to_timestamp($1, 'YYYY-MM-DD HH24:MI:SS') AND to_timestamp($2, 'YYYY-MM-DD HH24:MI:SS')";
    const values = [dateTimeReserved + " 00:00:00", dateTimeReserved + " 23:59:59"];
    return client.query(text, values);
}

module.exports.addReservation = async (client, idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment) => {
    const text = "INSERT INTO reservation (person_id, date_time_reserved, customers_nbr, table_id, establishment_id) VALUES ($1, to_timestamp($2, 'YYYY-MM-DD HH24:MI'), $3, $4, $5)";
    const values = [idPerson, dateTimeReserved, nbCustomers, idTable, idEstablishment];
    return client.query(text, values);
}

module.exports.updateAdditionalInformations = async (client, idPerson, dateTimeReserved, additionnalInformation) => {
    const text = "UPDATE reservation SET additional_info = $1 WHERE person_id = $2 AND date_time_reserved = $3";
    const values = [additionnalInformation, idPerson, dateTimeReserved];
    return client.query(text, values);
}

module.exports.updateReservation = async (client, idPerson, dateTimeReserved, newDateTimeReserved, nbCustomers, additionnalInformation, idTable, idEstablishment) => {
    let text = "UPDATE reservation SET date_time_reserved = to_timestamp($1, 'YYYY-MM-DD HH24:MI'), customers_nbr = $2, table_id = $3, establishment_id = $4";
    let values = [newDateTimeReserved, nbCustomers, idTable, idEstablishment];

    if(additionnalInformation !== undefined){
        values.push(additionnalInformation);
        text += ", additional_info = $" + values.length;
    }

    values.push(idPerson);
    text += " WHERE person_id =  $" + values.length;

    values.push(dateTimeReserved);
    text += " AND date_time_reserved = to_timestamp($" + values.length + ", 'YYYY-MM-DD HH24:MI')";

    return client.query(text, values);
}

module.exports.updateArrivingTime = async (client, idPerson, dateTimeReserved, arrivingTime) => {
    const text = "UPDATE reservation SET arriving_time = to_timestamp($1, 'HH24:MI'), is_cancelled = $2 WHERE person_id = $3 AND date_time_reserved = to_timestamp($4, 'YYYY-MM-DD HH24:MI')";
    const values = [arrivingTime, false, idPerson, dateTimeReserved];
    return client.query(text, values);
}

module.exports.updateExitTime = async (client, idPerson, dateTimeReserved, exitTime) => {
    const text = "UPDATE reservation SET exit_time = to_timestamp($1, 'HH24:MI') WHERE person_id = $2 AND date_time_reserved = to_timestamp($3, 'YYYY-MM-DD HH24:MI')";
    const values = [exitTime, idPerson, dateTimeReserved];
    return client.query(text, values);
}

module.exports.cancelReservation = async (client, idPerson, dateTimeReserved) => {
    const text = "UPDATE reservation SET is_cancelled = $1 WHERE person_id = $2 AND date_time_reserved = to_timestamp($3, 'YYYY-MM-DD HH24:MI')";
    const values = [true, idPerson, dateTimeReserved];
    return client.query(text, values);
}