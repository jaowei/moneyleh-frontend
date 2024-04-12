import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";

export type TransactionTypeModel = {
  id: string;
  createdAt: string;
  name: string;
};

const baseTransactionTypes = [
  "Transfer",
  "Salary",
  "Bonus",
  "Interest",
  "Dividend",
  "Cash",
  "Tax",
  "Allowance",
  "Bill Payment",
  "Misc Fees",
  "Rebates & Payouts",
];

const TransactionType: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE transactionType (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char);",
    insertOne: "INSERT INTO transactionType(name) VALUES (?)",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionTypes);
  },
};

export { TransactionType };
