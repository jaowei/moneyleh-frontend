import { persistDB } from "../sqljs";
import { DatabaseModel } from "../../../types";
import { SqlValue } from "sql.js";

export type AccountModel = {
  $id?: string;
  $createdAt?: string;
  $name: string;
  $accountTypeId: number;
  $financialEntityId: number;
  $startingBalance: number;
};

const Account: DatabaseModel<AccountModel, SqlValue[]> = {
  queries: {
    createTable:
      "CREATE TABLE account (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE, accountTypeId int, startingBalance int, financialEntityId INTEGER, FOREIGN KEY(financialEntityId) REFERENCES financialEntity(id), FOREIGN KEY(accountTypeId) REFERENCES accountType(id));",
    insertOne:
      "INSERT INTO account(name, type, accountingRelation, financialEntityId, startingBalance) VALUES ($name, $accountTypeId, $financialEntityId, $startingBalance) RETURNING id;",
    selectAll: "SELECT * FROM account ORDER BY name ASC;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
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
    return db.exec(this.queries.selectAll)[0]?.values;
  },
};

export { Account };
