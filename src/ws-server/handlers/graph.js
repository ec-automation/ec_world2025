const { getConnection } = require('../../lib/database');

async function loadGraph(socket, data) {
  try {
    console.log('📥 Cliente solicita cargar grafo...');

    const conn = await getConnection();

    // Buscar el grafo del usuario
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

    // Traer TODOS los nodos del grafo
    const [nodesFromDB] = await conn.execute(
      `SELECT id, label, type, position_x, position_y, background_color, icon FROM nodes WHERE graph_id = ?`,
      [graphId]
    );

    console.log('📦 Nodos obtenidos desde MySQL:', nodesFromDB);

    // Armar objetos React Flow
    const nodes = nodesFromDB.map(node => ({
      id: String(node.id),
      type: 'customNode',
      data: {
        label: node.label || 'Sin nombre',
        type: node.type || 'unknown',
        backgroundColor: node.background_color || '#334155',
        icon: node.icon || '🔲',
      },
      position: {
        x: node.position_x !== null ? node.position_x : 100,
        y: node.position_y !== null ? node.position_y : 100,
      },
    }));

    // Cargar edges
    const [edgesFromDB] = await conn.execute(
      `SELECT id, source, target FROM edges WHERE graph_id = ?`,
      [graphId]
    );

    const edges = edgesFromDB.map(edge => ({
      id: String(edge.id),
      source: String(edge.source),
      target: String(edge.target),
    }));

    conn.end();

    console.log(`✅ Grafo final cargado: { graphId: ${graphId}, nodesCount: ${nodes.length}, edgesCount: ${edges.length} }`);
    socket.emit('graph-loaded', { graphId, nodes, edges });

  } catch (err) {
    console.error('❌ Error al cargar o crear grafo:', err);
    socket.emit('graph-loaded', { graphId: null, nodes: [], edges: [] });
  }
}

module.exports = { loadGraph };
