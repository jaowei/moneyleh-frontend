import { DatabaseModel } from "../../../types";

export type TransactionModel = {
  id: string;
  createdAt: string;
  transactionDate: string;
  description: string;
  amount: number;
  transactionMethodId: string;
  transactionTypeId: string;
  transactionCategoryId: string;
  transactionSubCategoryId: string;
  accountId: string;
  isInternal: boolean;
};

const FinancialTransaction: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE financialTransaction (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, transactionDate char, description char, amount int, transactionMethodId int, transactionTypeId int, accountId int, isInternal boolean, FOREIGN KEY(transactionMethodId) REFERENCES transactionMethod(id), FOREIGN KEY(transactionTypeId) REFERENCES transactionType(id), FOREIGN KEY(accountId) REFERENCES account(id));",
    insertOne: "",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
};

export { FinancialTransaction };
