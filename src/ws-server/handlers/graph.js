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

    // Aquí ya tienes el graphId, ahora cargamos nodos y edges
    const [nodesFromDb] = await conn.execute(
      `SELECT id, label, type, position_x AS x, position_y AS y FROM nodes WHERE graph_id = ?`,
      [graphId]
    );
    const [edges] = await conn.execute(
      `SELECT id, source, target FROM edges WHERE graph_id = ?`,
      [graphId]
    );

    // Cargar empresas asociadas al usuario
    const [companies] = await conn.execute(
      `SELECT id, name FROM companies WHERE user_id = ?`,
      [socket.user_id]
    );

    console.log(`🏢 Empresas encontradas: ${companies.length}`);

    const extraNodes = companies.map((company) => {
      console.log(`➕ Agregando empresa al grafo: ${company.name}`);
      return {
        id: `company-${company.id}`,
        type: 'customNode',
        data: { label: company.name },
        position: {
          x: Math.random() * 600,
          y: Math.random() * 400,
        },
      };
    });

    conn.end();

    const finalNodes = [...nodesFromDb, ...extraNodes];

    console.log('✅ Grafo final cargado:', { graphId, nodesCount: finalNodes.length, edgesCount: edges.length });
    socket.emit('graph-loaded', { graphId, nodes: finalNodes, edges });
  } catch (err) {
    console.error('❌ Error al cargar o crear grafo:', err);
    socket.emit('graph-loaded', { graphId: null, nodes: [], edges: [] });
  }
}

module.exports = { loadGraph };
