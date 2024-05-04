import { AccountTypes } from "../../../constants";
import {
  FinancialTransactionMapParams,
  TransactionMethods,
} from "../../storage";

export const isInSameRow = (
  prevCoord: number,
  currentCoord: number,
  diff = 12
): boolean => {
  return Math.abs(currentCoord - prevCoord) <= diff;
};

export const mapToFinancialTransaction = ({
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

export const accountTypeConverter = (accountType?: string) => {
  if (accountType === AccountTypes.CREDITCARD) {
    return TransactionMethods.cardPhysical;
  }
  return "";
};
