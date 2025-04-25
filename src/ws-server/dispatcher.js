// Todo en CommonJS
const company = require("./handlers/company");
const preferences = require("./handlers/preferences");
const login = require("./handlers/login"); // <-- agregar esta línea
const initialize = require("./handlers/initialize"); // <-- nuevo
const graph = require("./handlers/graph"); // <-- nuevo

const dispatcher = {
  'create-company': company.create,
  'update-preferences': preferences.updatePreferences,
  'login': login.login, // <-- agregar esta línea
  'initialize-user': initialize.initializeUser, // <-- nuevo
  'get-graph': graph.getGraph, // <-- nuevo
};

module.exports = dispatcher;
