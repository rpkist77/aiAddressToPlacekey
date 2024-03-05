import sql from "mssql";
import { sqlConfig } from "./sqlConfig";

let pool: sql.ConnectionPool;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(sqlConfig);
  }
  return pool;
}
