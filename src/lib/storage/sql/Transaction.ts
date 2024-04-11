import { DatabaseModel } from "../../../types";

export type TransactionModel = {
  id: string;
  createdAt: string;
  transactionDate: string;
  description: string;
  amount: number;
  transactionMethodId: string;
  transactionTypeId: string;
  debitAccountId: string;
  creditAccountId: string;
};

const FinancialTransaction: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE financialTransaction (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, transactionDate char, description char, amount int, transactionMethodId int, transactionTypeId int, debitAccountId int, creditAccountId int, FOREIGN KEY(transactionMethodId) REFERENCES transactionMethod(id), FOREIGN KEY(transactionTypeId) REFERENCES transactionType(id), FOREIGN KEY(debitAccountId) REFERENCES account(id), FOREIGN KEY(creditAccountId) REFERENCES account(id));",
    insertOne: "",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
};

export { FinancialTransaction };
