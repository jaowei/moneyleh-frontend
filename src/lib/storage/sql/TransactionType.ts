import { DatabaseModel } from "../../../types";
import { databaseSeeder, stepper } from "../utils";

export type TransactionTypeModel = {
  id: string;
  createdAt: string;
  name: string;
};

export const TransactionTypes = {
  needs: "Needs",
  wants: "Wants",
  income: "Income",
  savings: "Savings",
  investments: "Investments",
} as const;

const baseTransactionTypes = Object.values(TransactionTypes);

const TransactionType: DatabaseModel<
  TransactionTypeModel,
  TransactionTypeModel
> = {
  queries: {
    createTable:
      "CREATE TABLE transactionType (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE);",
    insertOne: "INSERT INTO transactionType(name) VALUES (?)",
    selectAll: "SELECT * FROM transactionType ORDER BY name ASC;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionTypes);
  },
  selectAll(db) {
    return stepper(
      db,
      this.queries.selectAll
    ) as unknown as TransactionTypeModel[];
  },
};

export { TransactionType, baseTransactionTypes };
