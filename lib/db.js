import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (!pool) {
    const isLocalEnv = (process.env.APP_ENV || "").toLowerCase() === "local";

    const host = isLocalEnv ? process.env.LOCAL_DB_HOST : process.env.DB_HOST;
    const port = isLocalEnv ? process.env.LOCAL_DB_PORT : process.env.DB_PORT;
    const user = isLocalEnv ? process.env.LOCAL_DB_USERNAME : process.env.DB_USERNAME;
    const database = isLocalEnv ? process.env.LOCAL_DB_DATABASE : process.env.DB_DATABASE;
    const password = isLocalEnv
      ? process.env.LOCAL_DB_PASSWORD || ""
      : process.env.DB_PASSWORD;

    pool = mysql.createPool({
      host: host || "127.0.0.1",
      port: parseInt(port || "3306", 10),
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  const db = getPool();
  const [rows] = await db.execute(sql, params);
  return rows;
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

export async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => "?").join(", ");
  const sql = `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES (${placeholders})`;
  const db = getPool();
  const [result] = await db.execute(sql, values);
  return result;
}

export async function bulkInsert(table, dataArray) {
  if (!dataArray.length) return null;
  const keys = Object.keys(dataArray[0]);
  const placeholders = dataArray
    .map(() => `(${keys.map(() => "?").join(", ")})`)
    .join(", ");
  const values = dataArray.flatMap((row) => keys.map((k) => row[k]));
  const sql = `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES ${placeholders}`;
  const db = getPool();
  const [result] = await db.execute(sql, values);
  return result;
}

export async function update(table, data, whereClause, whereParams = []) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((k) => `\`${k}\` = ?`).join(", ");
  const sql = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`;
  const db = getPool();
  const [result] = await db.execute(sql, [...values, ...whereParams]);
  return result;
}

export async function remove(table, whereClause, whereParams = []) {
  const sql = `DELETE FROM \`${table}\` WHERE ${whereClause}`;
  const db = getPool();
  const [result] = await db.execute(sql, whereParams);
  return result;
}
