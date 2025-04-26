const company = require('./handlers/company');
const node = require('./handlers/node');
const edge = require('./handlers/edge');
const preferences = require('./handlers/preferences');
const graph = require('./handlers/graph');
const login = require('./handlers/login');
const dispatcher = {
  'login': login.login,  // <-- agregamos aquí
  'create-company': company.create,
  'create-node': node.create,
  'create-edge': edge.create,
  'update-preferences': preferences.updatePreferences,
  'load-graph': graph.loadGraph,   // ✅ corregido aquí
};

module.exports = dispatcher;
