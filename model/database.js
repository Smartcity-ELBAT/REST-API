const pg = require("pg");
const Pool = pg.Pool;
require("dotenv").config({ path: __dirname + "./../.env"});

const pool = new Pool({
	user: process.env.DB_USERNAME,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT
});

module.exports = pool;
