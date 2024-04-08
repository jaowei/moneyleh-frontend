import { Database } from "sql.js";

export const createFinancialEntitySql =
  "CREATE TABLE financialEntity (id int, name char, createdAt text, isDeleted boolean);";

export const insertFinancialEntitySql =
  "INSERT INTO financialEntity VALUES (?, ?, ?, ?);";

export const selectAllFinancialEntitiesSql = "SELECT * FROM financialEntity;";

export const financialEntities = [
  "DBS",
  "UOB",
  "OCBC",
  "SCB",
  "HSBC",
  "Citi",
  "CPF",
  "IBKR",
  "Moo Moo",
  "Syfe",
  "Tiger Brokers",
];

export const initFETable = (db: Database) => {
  db.run(createFinancialEntitySql);
  const stmt = db.prepare(insertFinancialEntitySql);
  for (let i = 0; i < financialEntities.length; i++) {
    stmt.bind([i + 1, financialEntities[i], new Date().toISOString(), 0]);
    stmt.step();
  }
};
