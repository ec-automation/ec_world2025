const { getConnection } = require("../../lib/database");

async function create(socket, data) {
  try {
    const { name, ruc, website, user_id } = data;

    if (!name || !ruc || !user_id) {
      socket.emit("company-created", { success: false, error: "Datos incompletos" });
      return;
    }

    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO companies (name, ruc, website, user_id) VALUES (?, ?, ?, ?)`,
      [name, ruc, website, user_id]
    );
    conn.end();

    socket.emit("company-created", { success: true, company_id: result.insertId });
  } catch (err) {
    console.error("❌ Error al crear empresa:", err);
    socket.emit("company-created", { success: false, error: err.message });
  }
}

module.exports = {
  create,
};
