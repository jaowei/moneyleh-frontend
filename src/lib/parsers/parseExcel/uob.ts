import { RowData } from "../../../types";
import { extendedDayjs, formatTransactionDate } from "../../../utils/dayjs";
import { FinancialTransactionView } from "../../storage";
import { descriptionToTags } from "../description";

export const isUOBCardFormat = (parsedContent: Array<any>) => {
  return parsedContent[0][0].includes("United Overseas Bank");
};

export const demoUOBFormat = (parsedContent: Array<any>) => {
  return parsedContent.reduce((prev: Array<RowData>, curr: Array<string>) => {
    if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
      const description = curr[2];
      const { transactionMethod, transactionType } =
        descriptionToTags(description);
      prev.push({
        date: formatTransactionDate(curr[0], "DD MM YYYY") ?? "",
        currency: curr[5],
        description,
        amount: parseFloat(curr?.at(-1) ?? "0"),
        transactionCode: transactionMethod,
        parentTag: transactionType,
      });
    }
    return prev;
  }, []);
};

export const appUOBFormat = (parsedContent: Array<any>) => {
  return parsedContent.reduce(
    (prev: Array<FinancialTransactionView>, curr: Array<string>) => {
      if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
        const description = curr[2];
        const { transactionMethod, transactionType } =
          descriptionToTags(description);
        prev.push({
          transactionDate: formatTransactionDate(curr[0], "DD MMM YYYY") ?? "",
          currency: curr[5],
          description,
          amount: parseFloat(curr?.at(-1) ?? "0"),
          transactionMethod: transactionMethod, // set as card as uob statement is for cards
          transactionType: transactionType, //  map using pre configured keywords
          account: "", // to get from top level
        });
      }
      return prev;
    },
    []
  );
};
