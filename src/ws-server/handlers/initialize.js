const { getConnection } = require('../../lib/database');

async function initializeUser(socket) {
  try {
    const userId = socket.user_id;
    if (!userId) {
      console.warn('⚠️ No hay user_id en socket.');
      return;
    }

    const conn = await getConnection();

    // ¿Ya tiene alguna empresa?
    const [companies] = await conn.execute('SELECT id FROM companies WHERE user_id = ?', [userId]);

    let companyId;
    if (companies.length === 0) {
      // Crear la primera empresa
      const [companyResult] = await conn.execute(
        `INSERT INTO companies (name, ruc, website, user_id) VALUES (?, ?, ?, ?)`,
        ['My First Company', '11111111111', 'https://mycompany.com', userId]
      );
      companyId = companyResult.insertId;
      console.log(`✅ Company creada: ID ${companyId}`);
    } else {
      companyId = companies[0].id;
    }

    // ¿Ya tiene graph?
    const [graphs] = await conn.execute('SELECT id FROM graphs WHERE user_id = ?', [userId]);

    let graphId;
    if (graphs.length === 0) {
      // Crear el graph base
      const [graphResult] = await conn.execute(
        `INSERT INTO graphs (name, company_id, user_id) VALUES (?, ?, ?)`,
        ['Default Graph', companyId, userId]
      );
      graphId = graphResult.insertId;
      console.log(`✅ Graph creado: ID ${graphId}`);
    } else {
      graphId = graphs[0].id;
    }

    conn.end();

    // Enviar al cliente el graph_id encontrado o creado
    socket.emit('user-initialized', { graphId });

  } catch (err) {
    console.error('❌ Error inicializando usuario:', err);
    socket.emit('user-initialized', { error: err.message });
  }
}

module.exports = { initializeUser };
