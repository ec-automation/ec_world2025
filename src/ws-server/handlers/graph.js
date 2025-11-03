const { getConnection } = require('../../lib/database');

async function loadGraph(socket, data) {
  try {
    const user = socket.user;
    console.log('📥 Cliente solicita cargar grafo');

    if (!socket.user_id) {
      console.warn('⚠️ No se puede cargar grafo: usuario no autenticado todavía.');
      socket.emit('graph-loaded', { graphId: null, nodes: [], edges: [] });
      return;
    }

    const conn = await getConnection();

    // Obtener el graph del usuario
    const [graphRows] = await conn.execute(
      'SELECT id FROM graphs WHERE user_id = ? LIMIT 1',
      [user.id]
    );

    if (graphRows.length === 0) {
      console.warn('⚠️ No se encontró grafo para el usuario:', user.id);
      socket.emit('graph-loaded', { graphId: null, nodes: [], edges: [] });
      conn.end();
      return;
    }

    const graphId = graphRows[0].id;

    // Obtener nodos con LEFT JOIN condicionales
    const [nodes] = await conn.execute(`
      SELECT 
        n.id,
        n.graph_id,
        n.label,
        n.icon,
        n.background_color,
        n.position_x,
        n.position_y,
        n.type,
        c.ruc,
        c.website,
        c.logo_url,
        cl.email,
        cl.phone
      FROM nodes n
      LEFT JOIN companies c ON c.node_id = n.id AND n.type = 'company'
      LEFT JOIN clients cl ON cl.node_id = n.id AND n.type = 'client'
      WHERE n.graph_id = ?
    `, [graphId]);

    // Obtener edges
    const [edges] = await conn.execute(`
      SELECT id, source, target
      FROM edges
      WHERE graph_id = ?
    `, [graphId]);

    conn.end();

    const formattedNodes = nodes.map(node => ({
      id: String(node.id),
      type: 'customNode',
      position: {
        x: node.position_x ?? 100,
        y: node.position_y ?? 100,
      },
      data: {
        label: node.label,
        backgroundColor: node.background_color,
        icon: node.icon,
        type: node.type,
        ruc: node.ruc,
        website: node.website,
        logo_url: node.logo_url,
        email: node.email,
        phone: node.phone,
      }
    }));

    const formattedEdges = edges.map(edge => ({
      id: String(edge.id),
      source: String(edge.source),
      target: String(edge.target),
    }));

    socket.emit('graph-loaded', {
      graphId,
      nodes: formattedNodes,
      edges: formattedEdges
    });

    console.log(`📤 Grafo enviado (ID: ${graphId}) con ${formattedNodes.length} nodos`);

  } catch (err) {
    console.error('❌ Error cargando grafo:', err);
    socket.emit('error', { message: 'Error cargando grafo' });
  }
}

module.exports = { loadGraph };
