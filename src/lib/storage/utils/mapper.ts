import {
  CreateFinancialTransactionDto,
  FinancialTransactionView,
} from "../sql";
import { staticInfo } from "../sqljs";

export const financialTransactionsMapper = (
  data: FinancialTransactionView[],
  databaseInfo: staticInfo,
  accountId: string
): CreateFinancialTransactionDto[] => {
  const financialTransactionModel: CreateFinancialTransactionDto[] = [];
  for (let row of data) {
    const methodId = databaseInfo.transactionMethods.get(
      row.transactionMethod
    )?.id;

    const typeId = databaseInfo.transactionTypes.get(
      row.transactionType ?? ""
    )?.id;

    const tagIds =
      row.transactionTag?.map((tagName) => {
        return databaseInfo.transactionTags.get(tagName)?.id;
      }) ?? [];

    financialTransactionModel.push({
      $transactionDate: row.transactionDate,
      $description: row.description,
      $amount: row.amount,
      $currency: row.currency,
      $transactionMethodId: methodId?.toString() ?? row.transactionMethod,
      $transactionTypeId: typeId?.toString() ?? row.transactionType,
      $accountId: accountId,
      $transactionTagIds: JSON.stringify(tagIds),
    });
  }
  return financialTransactionModel;
};
