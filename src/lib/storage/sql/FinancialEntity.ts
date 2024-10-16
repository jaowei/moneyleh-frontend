import { Database } from "sql.js";
import { persistDB } from "../sqljs";

export type FinancialEntityModel = {
  id: string;
  createdAt: string;
  name: string;
  isDeleted: boolean;
};

const FinancialEntity = {
  queries: {
    createTable:
      "CREATE TABLE financialEntity (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE, isDeleted boolean);",
    insertOne: "INSERT INTO financialEntity(name) VALUES (?) RETURNING id;",
    selectAll: "SELECT * FROM financialEntity ORDER BY name ASC;",
  },
  initTable(db: Database) {
    db.run(this.queries.createTable);
  },
  async insertOne(db: Database, data: string) {
    const stmt = db.prepare(this.queries.insertOne);
    stmt.bind([data]);
    stmt.step();
    const id = stmt.get();
    stmt.free();
    await persistDB(db);
    return id;
  },
  selectAll(db: Database) {
    return db.exec(this.queries.selectAll)[0]?.values;
  },
};

export { FinancialEntity };
