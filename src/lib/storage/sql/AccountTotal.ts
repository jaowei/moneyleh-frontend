import { Database } from "sql.js";
import { stepper } from "../utils";

export type AccountTotalView = {
  name: string;
  startingBalance: number;
  currentBalance: number;
  latestTransaction: string;
  financialEntityId: number;
};

export const AccountTotal = {
  queries: {
    sum: `SELECT account.name, account.startingBalance, SUM(financialTransaction.amount) AS currentBalance, account.financialEntityId, MIN(financialTransaction.transactionDate) AS latestTransactionDate
          FROM financialTransaction 
          INNER JOIN account ON account.id = financialTransaction.accountId GROUP BY financialTransaction.accountId
          ORDER BY startingBalance DESC, financialEntityId ASC;`,
  },
  getTotal(db: Database) {
    return stepper(db, this.queries.sum) as unknown as AccountTotalView[];
  },
};
