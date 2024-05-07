import { AccountTypes } from "../../../constants";
import { TransactionMethods } from "../../storage";

export const isInSameRow = (
  prevCoord: number,
  currentCoord: number,
  diff = 12
): boolean => {
  return Math.abs(currentCoord - prevCoord) <= diff;
};

export const accountTypeConverter = (accountType?: string) => {
  if (accountType === AccountTypes.CREDITCARD) {
    return TransactionMethods.cardPhysical;
  }
  return "";
};
