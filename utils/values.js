module.exports.allDefined = (...values) => values.every(value => value !== undefined);
module.exports.numericValues = (...values) => values.every(value => !isNaN(value));