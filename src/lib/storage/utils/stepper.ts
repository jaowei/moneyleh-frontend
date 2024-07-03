import { Database } from "sql.js";

export const stepper = (db: Database, statement: string) => {
  const data = [];
  const stmt = db.prepare(statement);
  while (stmt.step()) {
    data.push(stmt.getAsObject());
  }
  stmt.free();
  return data;
};
