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
  account?: string;
  transactionTag?: Array<string>;
};

export type CreateFinancialTransactionDto = {
  $id?: string;
  $createdAt?: string;
  $transactionDate: string;
  $description: string;
  $amount: number;
  $currency: string;
  $transactionMethodId?: string;
  $transactionTypeId?: string;
  $accountId?: string;
  $transactionTagIds?: string;
};

const FinancialTransaction: DatabaseModel<
  CreateFinancialTransactionDto,
  FinancialTransactionView
> = {
  queries: {
    createTable:
      "CREATE TABLE financialTransaction (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, transactionDate char, description char, amount int, currency char, transactionMethodId int, transactionTypeId int, accountId int, transactionTagIds TEXT, FOREIGN KEY(transactionMethodId) REFERENCES transactionMethod(id), FOREIGN KEY(transactionTypeId) REFERENCES transactionType(id),  FOREIGN KEY(accountId) REFERENCES account(id));",
    insertOne:
      "INSERT INTO financialTransaction(transactionDate, description, amount, currency, transactionMethodId, transactionTypeId, accountId, transactionTagIds) VALUES ($transactionDate, $description, $amount, $currency, $transactionMethodId, $transactionTypeId, $accountId, $transactionTagIds) RETURNING id;",
    selectAll: `SELECT transactionDate, description, amount, currency, transactionMethod.name AS transactionMethod, transactionType.name AS transactionType,  
    account.name as account, transactionTagIds as transactionTag
    from financialTransaction 
    LEFT JOIN transactionMethod ON financialTransaction.transactionMethodId=transactionMethod.id
    LEFT JOIN transactionType ON financialTransaction.transactionTypeId=transactionType.id
    LEFT JOIN account ON financialTransaction.accountId=account.id
    ORDER BY account ASC;`,
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
  insertMany(db, data) {
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, data);
    persistDB(db);
  },
  async insertOne(db, data) {
    const stmt = db.prepare(this.queries.insertOne);
    stmt.bind(data);
    stmt.step();
    const id = stmt.get();
    stmt.free();
    await persistDB(db);
    return id;
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
