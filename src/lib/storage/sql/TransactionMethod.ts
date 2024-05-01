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
      "CREATE TABLE transactionMethod (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE);",
    insertOne: "INSERT INTO transactionMethod(name) VALUES (?)",
    selectAll: "SELECT * FROM transactionMethod;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionMethods);
  },
  selectAll(db) {
    return db.exec(this.queries.selectAll)[0]?.values;
  },
};

export { TransactionMethod, baseTransactionMethods };
