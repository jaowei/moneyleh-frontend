import { persistDB } from "../sqljs";
import { DatabaseModel } from "../../../types";

export type AccountModel = {
  $id?: string;
  $createdAt?: string;
  $name: string;
  $type: string;
  $accountingRelation: string;
  $financialEntityId: string;
  $startingBalance: number;
};

const Account: DatabaseModel<AccountModel> = {
  queries: {
    createTable:
      "CREATE TABLE account (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE, type char, accountingRelation char, startingBalance int, financialEntityId INTEGER, FOREIGN KEY(financialEntityId) REFERENCES financialEntity(id));",
    insertOne:
      "INSERT INTO account(name, type, accountingRelation, financialEntityId, startingBalance) VALUES ($name, $type, $accountingRelation, $financialEntityId, $startingBalance) RETURNING id;",
    selectAll: "SELECT * FROM account;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
  },
  insertOne(db, data) {
    const stmt = db.prepare(this.queries.insertOne);
    stmt.bind(data);
    stmt.step();
    const id = stmt.get();
    stmt.free();
    persistDB(db);
    return id;
  },
  selectAll(db) {
    return db.exec(this.queries.selectAll)[0]?.values;
  },
};

export { Account };
