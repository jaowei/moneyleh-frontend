import { FinancialTransactionModel, FinancialTransactionView } from "../sql";
import { staticInfo } from "../sqljs";

export const mapToFinancialTransaction = ({
  transactionDate,
  description,
  amount,
  currency,
  transactionMethod,
  transactionType,
  account,
  isInternal,
}: FinancialTransactionView) => ({
  $transactionDate: transactionDate,
  $description: description,
  $amount: amount,
  $currency: currency,
  $transactionMethodId: transactionMethod,
  $transactionTypeId: transactionType,
  $accountId: account,
  $isInternal: +!!isInternal, // convert to number
});

export const financialTransactionsMapper = (
  data: FinancialTransactionView[],
  databaseInfo: staticInfo,
  accountId: string
): FinancialTransactionModel[] => {
  const financialTransactionModel: FinancialTransactionModel[] = [];
  for (let row of data) {
    const dbModel = mapToFinancialTransaction(row);
    dbModel.$accountId = accountId;

    const methodArr = databaseInfo.transactionMethods.filter((method) => {
      return method.includes(dbModel.$transactionMethodId);
    });
    dbModel.$transactionMethodId =
      methodArr?.[0]?.[0]?.toString() ?? dbModel.$transactionMethodId;

    const typeArr = databaseInfo.transactionTypes.filter((type) => {
      return type.includes(dbModel.$transactionTypeId ?? null);
    });
    dbModel.$transactionTypeId =
      typeArr?.[0]?.[0]?.toString() ?? dbModel.$transactionTypeId;

    financialTransactionModel.push(dbModel);
  }
  return financialTransactionModel;
};
