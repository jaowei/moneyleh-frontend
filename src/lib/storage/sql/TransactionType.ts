import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";

export type TransactionTypeModel = {
  id: string;
  createdAt: string;
  name: string;
};

export const TransactionTypes = {
  insurance: "Insurance",
  transport: "Transportation",
  shopping: "Shopping",
  dining: "Dining",
  groceries: "Groceries",
  healthcare: "Healthcare",
  fitness: "Fitness",
  travel: "Travel",
  transfer: "Transfer",
  salary: "Salary",
  bonus: "Bonus",
  interest: "Interest",
  dividend: "Dividend",
  cash: "Cash",
  tax: "Tax",
  allowance: "Allowance",
  billPayment: "Bill Payment",
  misc: "Misc Fees",
  rebates: "Rebates & Payouts",
  memberships: "Memberships",
} as const;

const baseTransactionTypes = [
  TransactionTypes.insurance,
  TransactionTypes.transport,
  TransactionTypes.shopping,
  TransactionTypes.dining,
  TransactionTypes.groceries,
  TransactionTypes.healthcare,
  TransactionTypes.fitness,
  TransactionTypes.travel,
  TransactionTypes.transfer,
  TransactionTypes.salary,
  TransactionTypes.bonus,
  TransactionTypes.interest,
  TransactionTypes.dividend,
  TransactionTypes.cash,
  TransactionTypes.tax,
  TransactionTypes.allowance,
  TransactionTypes.billPayment,
  TransactionTypes.misc,
  TransactionTypes.rebates,
];

const TransactionType: DatabaseModel<TransactionTypeModel> = {
  queries: {
    createTable:
      "CREATE TABLE transactionType (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE);",
    insertOne: "INSERT INTO transactionType(name) VALUES (?)",
    selectAll: "SELECT * FROM transactionType;",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionTypes);
  },
  selectAll(db) {
    return db.exec(this.queries.selectAll)[0]?.values;
  },
};

export { TransactionType, baseTransactionTypes };
