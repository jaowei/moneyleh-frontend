import { Database } from "sql.js";
import { stepper } from "../utils";

export type AccountTotalView = {
  name: string;
  startingBalance: number;
  currentBalance: number;
  latestTransaction: string;
};

export const AccountTotal = {
  queries: {
    sum: `SELECT account.name, account.startingBalance, SUM(financialTransaction.amount) AS runningTotal FROM financialTransaction 
        INNER JOIN account ON account.id = financialTransaction.accountId GROUP BY financialTransaction.accountId;`,
  },
  getTotal(db: Database) {
    return stepper(db, this.queries.sum);
  },
};
