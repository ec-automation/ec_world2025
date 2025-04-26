const { getConnection } = require('../../lib/database');

async function create(socket, data) {
  try {
    console.log('🔗 Creando nueva conexión (edge):', data);

    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO edges (graph_id, source, target) VALUES (?, ?, ?)`,
      [
        data.graph_id,
        data.source,
        data.target,
      ]
    );
    conn.end();

    const newEdge = {
      id: result.insertId.toString(),
      source: data.source,
      target: data.target,
    };

    socket.emit('edge-created', newEdge);
  } catch (err) {
    console.error('❌ Error creando conexión:', err);
  }
}

module.exports = { create };
