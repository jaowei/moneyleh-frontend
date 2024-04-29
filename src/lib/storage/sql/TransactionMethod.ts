import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";

export type TransactionMethodModel = {
  id: string;
  createdAt: string;
  name: string;
};

const baseTransactionMethods = [
  "Paynow",
  "Paylah",
  "FAST Transfer",
  "GIRO",
  "Card - Physical",
  "Card - Online",
  "Card - Installment",
  "Card - Recurring",
];

const TransactionMethod: DatabaseModel<TransactionMethodModel> = {
  queries: {
    createTable:
      "CREATE TABLE transactionMethod (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char);",
    insertOne: "INSERT INTO transactionMethod(name) VALUES (?)",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionMethods);
  },
};

export { TransactionMethod, baseTransactionMethods };
