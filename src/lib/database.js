const mysql = require("mysql2/promise");

// ...

async function getConnection() {
  const connection = await mysql.createConnection({
    host: "ecworldaidatabase.czmacqcao3r0.us-east-2.rds.amazonaws.com",
    user: "User1",
    password: "automation",
    database: "ecworldaidb",
  });

  return connection;
}

module.exports = {
  getConnection,
};
