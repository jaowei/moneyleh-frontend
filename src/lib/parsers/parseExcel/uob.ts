import { WorkBook, utils } from "xlsx";
import { RowData } from "../../../types";
import { extendedDayjs } from "../../../utils/dayjs";
import { FinancialTransactionModel } from "../../storage";
import { mapToFinancialTransaction } from "../utils";

// To Deprecate
export const parseUOBFormat = (workbook: WorkBook): Array<RowData> => {
  const parsedContent = utils.sheet_to_json<any>(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: 1 }
  );
  return parsedContent.reduce((prev: Array<RowData>, curr: Array<string>) => {
    if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
      prev.push({
        date: curr[0],
        currency: curr[5],
        description: curr[2],
        amount: parseFloat(curr?.at(-1) ?? "0"),
      });
    }
    return prev;
  }, []);
};

export const demoUOBFormat = (parsedContent: Array<any>) => {
  return parsedContent.reduce((prev: Array<RowData>, curr: Array<string>) => {
    if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
      prev.push({
        date: curr[0],
        currency: curr[5],
        description: curr[2],
        amount: parseFloat(curr?.at(-1) ?? "0"),
      });
    }
    return prev;
  }, []);
};

export const appUOBFormat = (parsedContent: Array<any>) => {
  return parsedContent.reduce(
    (prev: Array<FinancialTransactionModel>, curr: Array<string>) => {
      if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
        prev.push(
          mapToFinancialTransaction({
            transactionDate: curr[0],
            currency: curr[5],
            description: curr[2],
            amount: parseFloat(curr?.at(-1) ?? "0"),
            transactionMethodId: "5", // set as card as uob statement is for cards
            transactionTypeId: "1", //  map using pre configured keywords
            transactionSubTypeId: "1", //  map using pre configured keywords
            accountId: "", // to get from top level
            isInternal: false, // false until marked true by user
          })
        );
      }
      return prev;
    },
    []
  );
};
