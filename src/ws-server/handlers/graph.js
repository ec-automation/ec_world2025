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

    // 🏢 Verificar empresas existentes del usuario
    const [companies] = await conn.execute(
      `SELECT id, name FROM companies WHERE user_id = ?`,
      [socket.user_id]
    );

    console.log(`🏢 Empresas encontradas: ${companies.length}`);

    for (const company of companies) {
      const [existingNodes] = await conn.execute(
        `SELECT id FROM nodes WHERE graph_id = ? AND label = ? AND type = 'company'`,
        [graphId, company.name]
      );

      if (existingNodes.length === 0) {
        console.log(`➕ Agregando empresa al grafo: ${company.name}`);

        await conn.execute(
          `INSERT INTO nodes (graph_id, label, type, background_color, icon, position_x, position_y)
           VALUES (?, ?, 'company', ?, ?, ?, ?)`,
          [graphId, company.name, '#e0e0e0', '🏢', Math.random() * 500, Math.random() * 500]
        );
      }
    }

    // 📦 Ahora cargar todos los nodos actualizados
    const [nodes] = await conn.execute(
      `SELECT id, label, type, position_x AS x, position_y AS y, background_color, icon FROM nodes WHERE graph_id = ?`,
      [graphId]
    );

    const [edges] = await conn.execute(
      `SELECT id, source, target FROM edges WHERE graph_id = ?`,
      [graphId]
    );

    conn.end();

    console.log('✅ Grafo final cargado:', { graphId, nodesCount: nodes.length, edgesCount: edges.length });
    socket.emit('graph-loaded', { graphId, nodes, edges });
  } catch (err) {
    console.error('❌ Error al cargar o crear grafo:', err);
    socket.emit('graph-loaded', { graphId: null, nodes: [], edges: [] });
  }
}

module.exports = { loadGraph };
