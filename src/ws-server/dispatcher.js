// Todo en CommonJS
const company = require("./handlers/company");
const preferences = require("./handlers/preferences");

const dispatcher = {
  'create-company': company.create,
  'update-preferences': preferences.updatePreferences,
};

module.exports = dispatcher;
