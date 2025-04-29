const company = require('./handlers/company');
const node = require('./handlers/node');
const edge = require('./handlers/edge');
const preferences = require('./handlers/preferences');
const graph = require('./handlers/graph');
const login = require('./handlers/login');

const dispatcher = {
  'create-company': company.create,
  'create-node': node.create,
  'create-edge': edge.create,
  'update-preferences': preferences.updatePreferences,
  'load-graph': graph.loadGraph, // <-- 🔥 CORREGIDO AQUI
  'login': login.login,
};

// Nuevo wrapper para loguear todos los eventos recibidos
module.exports = new Proxy(dispatcher, {
  get(target, prop) {
    console.log(`📩 Evento recibido en dispatcher: "${prop}"`);
    return target[prop];
  }
});
