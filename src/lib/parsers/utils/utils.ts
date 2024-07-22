import { AccountTypes, TransactionMethods } from "../../storage";

export const isInSameRow = (
  prevCoord: number,
  currentCoord: number,
  diff = 12
): boolean => {
  return Math.abs(currentCoord - prevCoord) <= diff;
};

export const accountTypeConverter = (accountType?: string) => {
  if (accountType === AccountTypes.creditCard) {
    return TransactionMethods.cardPhysical.name;
  }
  return "";
};
