import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";

export type TransactionMethodModel = {
  id: string;
  createdAt: string;
  name: string;
};

export const TransactionMethods = {
  paynow: "Paynow",
  paylah: "Paylah",
  fast: "FAST Transfer",
  giro: "GIRO",
  cardPhysical: "Card - Physical",
  cardOnline: "Card - Online",
  cardInstallment: "Card - Installment",
} as const;

const baseTransactionMethods = [
  TransactionMethods.paynow,
  TransactionMethods.paylah,
  TransactionMethods.fast,
  TransactionMethods.giro,
  TransactionMethods.cardPhysical,
  TransactionMethods.cardOnline,
  TransactionMethods.cardInstallment,
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
