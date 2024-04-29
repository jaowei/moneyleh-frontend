import { FinancialTransactionMapParams } from "../../storage";

export const isInSameRow = (
  prevCoord: number,
  currentCoord: number,
  diff = 12
): boolean => {
  return Math.abs(currentCoord - prevCoord) <= diff;
};

export const mapToFinancialTransaction = ({
  id,
  createdAt,
  transactionDate,
  description,
  amount,
  currency,
  transactionMethodId,
  transactionTypeId,
  transactionSubTypeId,
  accountId,
  isInternal,
}: FinancialTransactionMapParams) => ({
  $id: id,
  $createdAt: createdAt,
  $transactionDate: transactionDate,
  $description: description,
  $amount: amount,
  $currency: currency,
  $transactionMethodId: transactionMethodId,
  $transactionTypeId: transactionTypeId,
  $transactionSubTypeId: transactionSubTypeId,
  $accountId: accountId,
  $isInternal: +isInternal, // convert to number
});
