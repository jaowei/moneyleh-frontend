import { DatabaseModel } from "../../../types";
import { persistDB } from "../sqljs";
import { databaseSeeder } from "../utils";

export type FinancialTransactionView = {
  transactionDate: string;
  description: string;
  amount: number;
  currency: string;
  transactionMethod: string;
  transactionType?: string;
  transactionSubType?: string;
  account?: string;
  isInternal?: boolean;
};

export type FinancialTransactionModel = {
  $id?: string;
  $createdAt?: string;
  $transactionDate: string;
  $description: string;
  $amount: number;
  $currency: string;
  $transactionMethodId: string;
  $transactionTypeId?: string;
  $transactionSubTypeId?: string;
  $accountId?: string;
  $isInternal?: number;
};

const FinancialTransaction: DatabaseModel<
  FinancialTransactionModel,
  FinancialTransactionView
> = {
  queries: {
    createTable:
      "CREATE TABLE financialTransaction (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, transactionDate char, description char, amount int, currency char, transactionMethodId int, transactionTypeId int, transactionSubTypeId int, accountId int, isInternal boolean, FOREIGN KEY(transactionMethodId) REFERENCES transactionMethod(id), FOREIGN KEY(transactionTypeId) REFERENCES transactionType(id), FOREIGN KEY(transactionSubTypeId) REFERENCES transactionSubType(id), FOREIGN KEY(accountId) REFERENCES account(id));",
    insertOne:
      "INSERT INTO financialTransaction(transactionDate, description, amount, currency, transactionMethodId, transactionTypeId, transactionSubTypeId, accountId, isInternal) VALUES ($transactionDate, $description, $amount, $currency, $transactionMethodId, $transactionTypeId, $transactionSubTypeId, $accountId, $isInternal);",
    selectAll: `SELECT transactionDate, description, amount, currency, transactionMethod.name AS transactionMethod, transactionType.name AS transactionType, 
    transactionSubType.name AS transactionSubType, 
    account.name as accountName
    from financialTransaction 
    LEFT JOIN transactionMethod ON financialTransaction.transactionMethodId=transactionMethod.id
    LEFT JOIN transactionType ON financialTransaction.transactionTypeId=transactionType.id
    LEFT JOIN transactionSubType ON financialTransaction.transactionSubTypeId=transactionSubType.id
    LEFT JOIN account ON financialTransaction.accountId=account.id;`,
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
  async insertMany(db, data) {
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, data);
    persistDB(db);
  },
  selectAll(db) {
    const data = [];
    const stmt = db.prepare(this.queries.selectAll);
    while (stmt.step()) {
      data.push(stmt.getAsObject() as unknown as FinancialTransactionView);
    }
    return data;
  },
};

export { FinancialTransaction };
