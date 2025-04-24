// lib/database.js
import mysql from "mysql2/promise";
import { createPool } from 'mysql2/promise';

// ...


export async function getConnection() {
  // const connection = await mysql.createConnection({
  //   host: "127.0.0.1",
  //   user: "user1",
  //   password: "pass1",
  //   database: "ec_home_ai_database",
  // });

  const connection = await mysql.createConnection({
    host: "ecworldaidatabase.czmacqcao3r0.us-east-2.rds.amazonaws.com",
    user: "User1",
    password: "automation",
    database: "ecworldaidb",
  });

  return connection;
}
