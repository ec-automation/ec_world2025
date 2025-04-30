const company = require('./handlers/company');
const node = require('./handlers/node');
const edge = require('./handlers/edge');
const preferences = require('./handlers/preferences');
const graph = require('./handlers/graph');
const login = require('./handlers/login');
const updateNodePosition = require('./handlers/update-node-position');
const deleteNode = require('./handlers/delete-node');
const updateNode = require('./handlers/update-node');
const dispatcher = {
  'create-company': company.create,
  'create-node': node.create,
  'create-edge': edge.create,
  'update-preferences': preferences.updatePreferences,
  'load-graph': graph.loadGraph, // <-- 🔥 CORREGIDO AQUI
  'login': login.login,
  'update-node-position': updateNodePosition.updateNodePosition,
  'delete-node': deleteNode.deleteNode,
  'update-node': updateNode.updateNode,
};

// Nuevo wrapper para loguear todos los eventos recibidos
module.exports = new Proxy(dispatcher, {
  get(target, prop) {
    return function (socket, data) {
      console.log(`📩 Evento recibido en dispatcher: "${prop}" con data:`, data);
      return target[prop](socket, data);
    };
  }
});