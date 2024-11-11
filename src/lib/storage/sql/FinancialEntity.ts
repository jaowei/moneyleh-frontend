import { Database } from "sql.js";
import { persistDB } from "../sqljs";
import { stepper } from "../utils";

export type FinancialEntityModel = {
  id: number;
  createdAt: string;
  name: string;
  isDeleted: boolean;
};

export type UpdateFinancialEntityDto = {
  $name: string;
  $id: number;
};

const FinancialEntity = {
  queries: {
    createTable:
      "CREATE TABLE financialEntity (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE, isDeleted boolean);",
    insertOne: "INSERT INTO financialEntity(name) VALUES (?) RETURNING id;",
    selectAll:
      "SELECT * FROM financialEntity ORDER BY name COLLATE NOCASE ASC;",
    updateOne: "UPDATE financialEntity SET name=$name WHERE id=$id;",
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
  async updateOne(db: Database, data: UpdateFinancialEntityDto) {
    const stmt = db.prepare(this.queries.updateOne);
    stmt.bind(data);
    stmt.step();
    stmt.free();
    await persistDB(db);
  },
  selectAll(db: Database) {
    return stepper(
      db,
      this.queries.selectAll
    ) as unknown as FinancialEntityModel[];
  },
};

export { FinancialEntity };
