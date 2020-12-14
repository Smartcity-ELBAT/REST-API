module.exports.allDefined = (...values) => values.every(value => value !== undefined && String(value).trim());
module.exports.numericValues = (...values) => values.every(value => !isNaN(value));