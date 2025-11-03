const { getConnection } = require('../../lib/database');

async function updateNodePosition(socket, data) {
  try {
    const { nodeId, graphId, x, y } = data;

    const conn = await getConnection();
    await conn.execute(
      `UPDATE nodes SET position_x = ?, position_y = ? WHERE id = ? AND graph_id = ?`,
      [x, y, nodeId, graphId]
    );
    conn.end();

    console.log(`✅ Posición actualizada para nodo ${nodeId}: x=${x}, y=${y}`);
  } catch (err) {
    console.error('❌ Error actualizando posición del nodo:', err);
  }
}

module.exports = { updateNodePosition };
