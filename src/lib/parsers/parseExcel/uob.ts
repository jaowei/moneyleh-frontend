import { WorkBook, utils } from "xlsx";
import { RowData } from "../../../types";
import { extendedDayjs } from "../../../utils/dayjs";
import { FinancialTransactionModel } from "../../storage";
import { mapToFinancialTransaction } from "../utils";
import { descriptionToTags } from "../description";

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
      const description = curr[2];
      const { transactionMethod, transactionType, transactionSubType } =
        descriptionToTags(description);
      prev.push({
        date: curr[0],
        currency: curr[5],
        description,
        amount: parseFloat(curr?.at(-1) ?? "0"),
        transactionCode: transactionMethod,
        parentTag: transactionType,
        childTag: transactionSubType,
      });
    }
    return prev;
  }, []);
};

export const appUOBFormat = (parsedContent: Array<any>) => {
  return parsedContent.reduce(
    (prev: Array<FinancialTransactionModel>, curr: Array<string>) => {
      if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
        const description = curr[2];
        const { transactionMethod, transactionType, transactionSubType } =
          descriptionToTags(description);
        prev.push(
          mapToFinancialTransaction({
            transactionDate: curr[0],
            currency: curr[5],
            description,
            amount: parseFloat(curr?.at(-1) ?? "0"),
            transactionMethodId: transactionMethod, // set as card as uob statement is for cards
            transactionTypeId: transactionType, //  map using pre configured keywords
            transactionSubTypeId: transactionSubType, //  map using pre configured keywords
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
