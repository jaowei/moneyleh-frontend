import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";
import { AccountTypes, DefaultAccountTypeIds } from "./AccountType";

export type TransactionMethodModel = {
  id: number;
  createdAt: string;
  name: string;
  accountTypeId: number;
};

export type CreateTransactionMethodModel = {
  $name: string;
  $accountTypeId: number;
};

export const TransactionMethods = {
  paynow: {
    name: "Paynow",
    accountType: AccountTypes.cash,
  },
  paylah: {
    name: "Paylah",
    accountType: AccountTypes.cash,
  },
  transfer: {
    name: "Transfer",
    accountType: AccountTypes.cash,
  },
  cardPhysical: {
    name: "Physical",
    accountType: AccountTypes.creditCard,
  },
  cardOnline: {
    name: "Online",
    accountType: AccountTypes.creditCard,
  },
  cardDevice: {
    name: "Device",
    accountType: AccountTypes.creditCard,
  },
  nets: {
    name: "Nets",
    accountType: AccountTypes.cash,
  },
  cash: {
    name: "Cash",
    accountType: AccountTypes.cash,
  },
};

const baseTransactionMethods = Object.values(TransactionMethods).map(
  (method) => {
    return {
      $name: method.name,
      $accountTypeId: DefaultAccountTypeIds[method.accountType],
    };
  }
);

const TransactionMethod: DatabaseModel<
  TransactionMethodModel,
  TransactionMethodModel
> = {
  queries: {
    createTable:
      "CREATE TABLE transactionMethod (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE, accountTypeId INTEGER, FOREIGN KEY(accountTypeId) REFERENCES accountType(id));",
    insertOne:
      "INSERT INTO transactionMethod(name, accountTypeId) VALUES ($name, $accountTypeId)",
    selectAll: "SELECT * FROM transactionMethod ORDER BY name ASC;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionMethods);
  },
  selectAll(db) {
    const row = [];
    const stmt = db.prepare(this.queries.selectAll);
    while (stmt.step()) {
      row.push(stmt.getAsObject() as TransactionMethodModel);
    }
    stmt.free();
    return row;
  },
};

export { TransactionMethod, baseTransactionMethods };
