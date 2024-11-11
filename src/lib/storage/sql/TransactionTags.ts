import { Database } from "sql.js";
import { stepper } from "../utils";
import { persistDB } from "../sqljs";

export interface TransactionTagModel {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface CreateTransactionTagDto {
  $name: string;
}

export type UpdateTransactionTagDto = {
  $name: string;
  $id: number;
};

export const defaultTags = {
  salary: "Salary",
  dining: "Dining",
  travel: "Travel",
  groceries: "Groceries",
  cpf: "CPF",
  tax: "Tax",
  transport: "Transport",
  healthcare: "Healthcare",
  fitness: "Fitness",
  leisure: "Leisure",
  shopping: "Shopping",
};

export const TransactionTag = {
  queries: {
    createTable: `CREATE TABLE transactionTag (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, 
      updatedAt DEFAULT CURRENT_TIMESTAMP, name TEXT UNIQUE);`,
    insertOne: `INSERT INTO transactionTag(name) VALUES ($name) RETURNING id;`,
    selectAll: `SELECT * FROM transactionTag ORDER BY name COLLATE NOCASE ASC;`,
    updateOne: `UPDATE transactionTag SET name=$name WHERE id=$id;`,
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
  async updateOne(db: Database, data: UpdateTransactionTagDto) {
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
    ) as unknown as TransactionTagModel[];
  },
};
