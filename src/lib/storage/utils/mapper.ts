import {
  CreateFinancialTransactionDto,
  FinancialTransactionView,
} from "../sql";
import { staticInfo } from "../sqljs";

export const mapToFinancialTransaction = ({
  transactionDate,
  description,
  amount,
  currency,
  transactionMethod,
  transactionType,
  account,
  transactionTag,
}: FinancialTransactionView) => ({
  $transactionDate: transactionDate,
  $description: description,
  $amount: amount,
  $currency: currency,
  $transactionMethodId: transactionMethod,
  $transactionTypeId: transactionType,
  $accountId: account,
  $transactionTagIds: JSON.stringify(transactionTag),
});

export const financialTransactionsMapper = (
  data: FinancialTransactionView[],
  databaseInfo: staticInfo,
  accountId: string
): CreateFinancialTransactionDto[] => {
  const financialTransactionModel: CreateFinancialTransactionDto[] = [];
  for (let row of data) {
    const dbModel = mapToFinancialTransaction(row);
    dbModel.$accountId = accountId;

    const methodId = databaseInfo.transactionMethods.get(
      dbModel.$transactionMethodId
    )?.id;

    dbModel.$transactionMethodId =
      methodId?.toString() ?? dbModel.$transactionMethodId;

    const typeId = databaseInfo.transactionTypes.get(
      dbModel.$transactionTypeId ?? ""
    )?.id;
    dbModel.$transactionTypeId =
      typeId?.toString() ?? dbModel.$transactionTypeId;

    financialTransactionModel.push(dbModel);
  }
  return financialTransactionModel;
};
