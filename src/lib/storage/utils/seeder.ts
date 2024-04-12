import { SqlValue, Statement } from "sql.js";

export const databaseSeeder = (
  stmt: Statement,
  data: Array<string | Array<SqlValue> | Record<string, SqlValue>>
): void => {
  for (let i = 0; i < data.length; i++) {
    const params = data[i];
    if (Array.isArray(params)) {
      stmt.bind([...params]);
    } else if (typeof params === "string") {
      stmt.bind([params]);
    } else {
      stmt.bind(params);
    }
    stmt.step();
  }
  stmt.free();
};
