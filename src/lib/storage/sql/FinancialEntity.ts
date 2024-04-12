import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";

export type FinancialEntityModel = {
  id: string;
  createdAt: string;
  name: string;
  isDeleted: boolean;
};

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

const FinancialEntity: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE financialEntity (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char, isDeleted boolean);",
    insertOne: "INSERT INTO financialEntity(name) VALUES (?);",
    selectAll: "SELECT * FROM financialEntity;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, financialEntities);
  },
};

export { FinancialEntity };
