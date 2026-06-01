import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";

let pool: Pool;

export function getPool(): Pool {
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

export async function query<T = RowDataPacket>(sql: string, params: unknown[] = []): Promise<T[]> {
  const db = getPool();
  const [rows] = await db.execute<RowDataPacket[]>(sql, params);
  return rows as T[];
}

export async function queryOne<T = RowDataPacket>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function insert(table: string, data: Record<string, unknown>): Promise<ResultSetHeader> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => "?").join(", ");
  const sql = `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES (${placeholders})`;
  const db = getPool();
  const [result] = await db.execute<ResultSetHeader>(sql, values);
  return result;
}

export async function bulkInsert(table: string, dataArray: Record<string, unknown>[]): Promise<ResultSetHeader | null> {
  if (!dataArray.length) return null;
  const keys = Object.keys(dataArray[0]);
  const placeholders = dataArray
    .map(() => `(${keys.map(() => "?").join(", ")})`)
    .join(", ");
  const values = dataArray.flatMap((row) => keys.map((k) => row[k]));
  const sql = `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES ${placeholders}`;
  const db = getPool();
  const [result] = await db.execute<ResultSetHeader>(sql, values);
  return result;
}

export async function update(table: string, data: Record<string, unknown>, whereClause: string, whereParams: unknown[] = []): Promise<ResultSetHeader> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((k) => `\`${k}\` = ?`).join(", ");
  const sql = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`;
  const db = getPool();
  const [result] = await db.execute<ResultSetHeader>(sql, [...values, ...whereParams]);
  return result;
}

export async function remove(table: string, whereClause: string, whereParams: unknown[] = []): Promise<ResultSetHeader> {
  const sql = `DELETE FROM \`${table}\` WHERE ${whereClause}`;
  const db = getPool();
  const [result] = await db.execute<ResultSetHeader>(sql, whereParams);
  return result;
}
