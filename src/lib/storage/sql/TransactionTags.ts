import { Database } from "sql.js";
import { databaseSeeder, stepper } from "../utils";

export type TransactionTagModel = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type CreateTransactionTagDto = {
  $name: string;
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
    insertOne: `INSERT INTO transactionTag(name) VALUES ($name);`,
    selectAll: `SELECT * FROM transactionTag ORDER BY name ASC;`,
  },
  initTable(db: Database) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, Object.values(defaultTags));
  },
  selectAll(db: Database) {
    return stepper(
      db,
      this.queries.selectAll
    ) as unknown as TransactionTagModel[];
  },
};
