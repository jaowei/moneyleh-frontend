import { DatabaseModel } from "../../../types";
import { persistDB } from "../sqljs";
import { databaseSeeder } from "../utils";

export type FinancialTransactionMapParams = {
  id?: string;
  createdAt?: string;
  transactionDate: string;
  description: string;
  amount: number;
  currency: string;
  transactionMethodId: string;
  transactionTypeId: string;
  transactionSubTypeId?: string;
  accountId: string;
  isInternal: boolean;
};

export type FinancialTransactionModel = {
  $id?: string;
  $createdAt?: string;
  $transactionDate: string;
  $description: string;
  $amount: number;
  $currency: string;
  $transactionMethodId: string;
  $transactionTypeId: string;
  $transactionSubTypeId?: string;
  $accountId: string;
  $isInternal: number;
};

const FinancialTransaction: DatabaseModel<FinancialTransactionModel> = {
  queries: {
    createTable:
      "CREATE TABLE financialTransaction (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, transactionDate char, description char, amount int, currency char, transactionMethodId int, transactionTypeId int, transactionSubTypeId int, accountId int, isInternal boolean, FOREIGN KEY(transactionMethodId) REFERENCES transactionMethod(id), FOREIGN KEY(transactionTypeId) REFERENCES transactionType(id), FOREIGN KEY(transactionSubTypeId) REFERENCES transactionSubType(id), FOREIGN KEY(accountId) REFERENCES account(id));",
    insertOne:
      "INSERT INTO financialTransaction(transactionDate, description, amount, currency, transactionMethodId, transactionTypeId, transactionSubTypeId, accountId, isInternal) VALUES ($transactionDate, $description, $amount, $currency, $transactionMethodId, $transactionTypeId, $transactionSubTypeId, $accountId, $isInternal);",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
  async insertMany(db, data) {
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, data);
    persistDB(db);
  },
};

export { FinancialTransaction };
