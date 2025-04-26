const { getConnection } = require('../../lib/database');

async function loadGraph(socket, data) {
  console.log("1")
  try {
    console.log('📥 Cliente solicita cargar grafo');

    const conn = await getConnection();

    // 1. Buscar grafo existente
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

    // 2. Cargar nodos y edges actuales
    const [nodes] = await conn.execute(
      `SELECT id, label, type, position_x AS x, position_y AS y, background_color, icon FROM nodes WHERE graph_id = ?`,
      [graphId]
    );
    const [edges] = await conn.execute(
      `SELECT id, source, target FROM edges WHERE graph_id = ?`,
      [graphId]
    );

    // 3. Buscar empresas existentes
    const [companies] = await conn.execute(
      `SELECT id, name FROM companies WHERE user_id = ?`,
      [socket.user_id]
    );

    console.log(`🏢 Empresas encontradas: ${companies.length}`);

    // 4. Agregar nodos de empresas si no existen
    let offsetX = 0;
    for (const company of companies) {
      const existingNode = nodes.find((n) => n.label === company.name);
      if (!existingNode) {
        console.log(`➕ Agregando empresa al grafo: ${company.name}`);
        nodes.push({
          id: `company-${company.id}`,
          type: 'customNode',
          position: { x: offsetX, y: 50 },
          data: { label: company.name, backgroundColor: '#333333', icon: '🏢' }
        });
        offsetX += 200; // separarlos horizontalmente
      }
    }

    conn.end();

    console.log('✅ Grafo final cargado:', { graphId, nodesCount: nodes.length, edgesCount: edges.length });

    socket.emit('graph-loaded', { graphId, nodes, edges });
  } catch (err) {
    console.error('❌ Error al cargar o crear grafo:', err);
    socket.emit('graph-loaded', { graphId: null, nodes: [], edges: [] });
  }
}

module.exports = { loadGraph };
