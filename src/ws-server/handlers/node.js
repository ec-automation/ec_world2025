const { getConnection } = require('../../lib/database');

// Ajustes de tamaño estimado del nodo para centrarlo respecto al cursor
const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

async function createNode(socket, data) {
  try {
    const { graph_id, type, position, label, backgroundColor, icon } = data;

    // Calcular posición centrada
    const centeredX = position.x - NODE_WIDTH / 2;
    const centeredY = position.y - NODE_HEIGHT / 2;

    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO nodes (graph_id, type, position_x, position_y, label, background_color, icon)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [graph_id, type, centeredX, centeredY, label, backgroundColor, icon]
    );

    const nodeId = result.insertId;

    // 🧠 Crear empresa si el nodo es tipo 'company'
    if (type === 'company') {
      await conn.execute(
        `INSERT INTO companies (graph_id, node_id, name, ruc, website)
         VALUES (?, ?, ?, ?, ?)`,
        [graph_id, nodeId, label || `Empresa-${Date.now()}`, generateRUC(), 'https://ecautomation.com']
      );
      console.log('🏢 Empresa asociada creada');
    }

    conn.end();

    const newNode = {
      id: String(nodeId),
      type: 'customNode',
      position: { x: centeredX, y: centeredY },
      data: { label, backgroundColor, icon, type },
    };

    socket.emit('node-created', newNode);
    console.log('✅ Nodo creado y emitido:', newNode);

  } catch (err) {
    console.error('❌ Error creando nodo:', err);
  }
}

function generateRUC() {
  return Math.floor(10000000000 + Math.random() * 89999999999).toString();
}

module.exports = { createNode };
