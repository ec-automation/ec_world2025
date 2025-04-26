const { getConnection } = require('../../lib/database');

async function create(socket, data) {
  try {
    console.log('🧩 Creando nuevo nodo:', data);

    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO nodes (graph_id, type, position_x, position_y, label) VALUES (?, ?, ?, ?, ?)`,
      [
        data.graph_id,
        data.type,
        data.position.x,
        data.position.y,
        data.label
      ]
    );
    conn.end();

    const newNode = {
      id: result.insertId.toString(),
      position: { x: data.position.x, y: data.position.y },
      type: 'customNode',
      data: { label: data.label },
    };

    socket.emit('node-created', newNode);
  } catch (err) {
    console.error('❌ Error creando nodo:', err);
  }
}

module.exports = { create };
