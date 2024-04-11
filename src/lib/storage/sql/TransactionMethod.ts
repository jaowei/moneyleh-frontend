import { DatabaseModel } from "../../../types";

export type TransactionMethodModel = {
  id: string;
  createdAt: string;
  name: string;
};

const TransactionMethod: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE transactionMethod (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char);",
    insertOne: "",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
};

export { TransactionMethod };
