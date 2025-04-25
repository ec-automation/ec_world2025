// Usar require en vez de import
const company = require("./handlers/company");

const dispatcher = {
  'create-company': company.create,
};

module.exports = dispatcher;
