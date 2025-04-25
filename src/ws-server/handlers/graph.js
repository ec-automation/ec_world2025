const { getConnection } = require('../../lib/database');

async function getGraph(socket, data) {
  try {
    const { graph_id } = data;

    if (!graph_id) {
      console.warn('⚠️ No se recibió graph_id.');
      return;
    }

    const conn = await getConnection();

    // Traer nodos
    const [nodes] = await conn.execute(
      `SELECT id, type, position_x AS x, position_y AS y, label FROM nodes WHERE graph_id = ?`,
      [graph_id]
    );

    // Más adelante haremos lo mismo con edges

    conn.end();

    socket.emit('graph-data', { nodes }); // 🚀 Enviamos los nodos al cliente
  } catch (err) {
    console.error('❌ Error obteniendo grafo:', err);
    socket.emit('graph-data', { error: err.message });
  }
}

module.exports = { getGraph };
