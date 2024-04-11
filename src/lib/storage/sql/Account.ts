import { persistDB } from "../sqljs";
import { DatabaseModel } from "../../../types";

export type AccountModel = {
  id: string;
  createdAt: string;
  name: string;
  type: string;
  accountingRelation: string;
  financialEntityId: string;
  startingBalance: number;
};

const defaultAccounts = [
  {
    $name: "Expense",
    $type: "default",
    $accountingRelation: "Expense",
    $startingBalance: 0,
    $financialEntityId: null,
  },
  {
    $name: "Income",
    $type: "default",
    $accountingRelation: "Revenue",
    $startingBalance: 0,
    $financialEntityId: null,
  },
];

const Account: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE account (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char, type char, accountingRelation char, startingBalance int, financialEntityId INTEGER, FOREIGN KEY(financialEntityId) REFERENCES financialEntity(id));",
    insertOne:
      "INSERT INTO account(name, type, accountingRelation, financialEntityId, startingBalance) VALUES ($name, $type, $accountingRelation, $financialEntityId, $startingBalance);",
    selectAll: "SELECT * FROM account;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    for (let i = 0; i < defaultAccounts.length; i++) {
      stmt.bind(defaultAccounts[i]);
      stmt.step();
    }
    stmt.free();
  },
  insertOne(db, data) {
    const stmt = db.prepare(this.queries.insertOne);
    stmt.bind(data);
    stmt.step();
    stmt.free();
    persistDB(db);
  },
};

export { Account };
