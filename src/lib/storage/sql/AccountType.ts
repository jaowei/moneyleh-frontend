import { Database } from "sql.js";
import { databaseSeeder } from "../utils";

export type AccountTypeModel = {
  id: number;
  createdAt: string;
  name: string;
};

export type CreateAccountTypeDto = {
  $name: string;
};

export enum AccountTypes {
  cash = "Cash",
  investment = "Investment",
  creditCard = "Credit Card",
}

export const DefaultAccountTypeIds: Record<string, number> = {
  [AccountTypes.cash]: 1,
  [AccountTypes.investment]: 2,
  [AccountTypes.creditCard]: 3,
};

export const defaultAccountTypes = Object.values(AccountTypes).map(
  (acctType) => {
    return {
      $name: acctType,
    };
  }
);

export const AccountType = {
  queries: {
    createTable:
      "CREATE TABLE accountType (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE);",
    insertOne: "INSERT INTO accountType(name) VALUES ($name);",
    selectAll: "SELECT * FROM accountType ORDER BY name ASC;",
  },
  initTable(db: Database) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, defaultAccountTypes);
  },
  selectAll(db: Database) {
    return db.exec(this.queries.selectAll)[0]?.values;
  },
};
