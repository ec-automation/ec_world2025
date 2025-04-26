const { getConnection } = require('../../lib/database');

async function loadGraph(socket, data) {
  try {
    console.log('📥 Cliente solicita cargar grafo');

    const conn = await getConnection();
    const [graphs] = await conn.execute(
      `SELECT id FROM graphs WHERE user_id = ? LIMIT 1`,
      [socket.user_id]
    );

    let graphId = null;

    if (graphs.length === 0) {
      console.log('🆕 No se encontró grafo, creando uno nuevo...');
      const [result] = await conn.execute(
        `INSERT INTO graphs (user_id, created_at) VALUES (?, NOW())`,
        [socket.user_id]
      );
      graphId = result.insertId;

      console.log('✅ Grafo creado con ID:', graphId);

      socket.emit('graph-created', { graphId });
    } else {
      graphId = graphs[0].id;
    }

    const [nodes] = await conn.execute(
      `SELECT id, label, type, position_x AS x, position_y AS y FROM nodes WHERE graph_id = ?`,
      [graphId]
    );
    const [edges] = await conn.execute(
      `SELECT id, source, target FROM edges WHERE graph_id = ?`,
      [graphId]
    );

    conn.end();

    console.log('✅ Grafo cargado:', { graphId, nodes, edges });
    socket.emit('graph-loaded', { graphId, nodes, edges });
  } catch (err) {
    console.error('❌ Error al cargar grafo:', err);
    socket.emit('graph-loaded', { graphId: null, nodes: [], edges: [] });
  }
}

module.exports = { loadGraph };
