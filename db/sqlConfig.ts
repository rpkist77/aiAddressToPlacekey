import sql from "mssql";

export const sqlConfig: sql.config = {
  user: process.env.P21_USER,
  password: process.env.P21_PASSWORD,
  server: process.env.P21_SERVER || "",
  database: process.env.P21_DATABASE,
  options: {
    enableArithAbort: true,
    encrypt: false,
  },
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};
