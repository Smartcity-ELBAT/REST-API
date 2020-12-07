const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.getPasswordHash = (string) => bcrypt.hash(string, saltRounds);

module.exports.matchPasswords = (string, hash) => bcrypt.compare(string, hash);