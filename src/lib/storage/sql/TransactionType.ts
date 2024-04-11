import { DatabaseModel } from "../../../types";

export type TransactionTypeModel = {
  id: string;
  createdAt: string;
  name: string;
};

const baseTransactionTypes = [
  "Internal Transfer",
  "Salary",
  "Interest",
  "Dividend",
  "Cash",
  "Tax",
];

const TransactionType: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE transactionType (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char);",
    insertOne: "",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
};

export { TransactionType };
