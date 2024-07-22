import { RowData } from "../../../../types";
import { extendedDayjs, formatTransactionDate } from "../../../../utils/dayjs";
import {
  FinancialTransactionModel,
  FinancialTransactionView,
} from "../../../storage";
import { descriptionToTags } from "../../description";
import { CSVParser } from "../parseCsv.types";

const keywordsParentTagMap = new Map([
  ["PAYLAH", "Paylah"],
  ["BILL CCC", "Creditcard"],
  ["PayNow", "Paynow"],
]);

const parseDBSNAVDescription = (description: string) => {
  const accountStartIdx = description.lastIndexOf(":");
  const accountNumber = description.slice(accountStartIdx + 2).trim();
  let childTag = null;
  let parentTag = null;

  for (let keyword of keywordsParentTagMap.keys()) {
    if (description.includes(keyword)) {
      parentTag = keywordsParentTagMap.get(keyword);
    }
  }

  return {
    accountNumber,
    parentTag,
    childTag,
  };
};

export const parseDBSDemoFormat: CSVParser<RowData> = (parsedContent) => {
  let currency = "SGD";
  return parsedContent.data.reduce(
    (prev: Array<RowData>, curr: Array<string>) => {
      if (curr[0] === "Currency:") {
        currency = curr[1].slice(0, 4);
      }
      if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
        let amount = 0;
        const debitAmt = curr.at(-6)?.trim();
        const creditAmt = curr.at(-5)?.trim();
        if (debitAmt) {
          amount = parseFloat(debitAmt) * -1;
        } else if (creditAmt) {
          amount = parseFloat(creditAmt);
        }
        const description = curr.slice(-4, -1).join(" ");
        const { transactionMethod, transactionType } =
          descriptionToTags(description);
        prev.push({
          date: curr[0],
          currency,
          description,
          amount,
          transactionCode: transactionMethod,
          parentTag: transactionType,
        });
      }
      return prev;
    },
    []
  );
};

export const parseDBSNAVDemoFormat: CSVParser<RowData> = (parsedContent) => {
  return parsedContent.data.reduce(
    (prev: Array<RowData>, curr: Array<string>) => {
      if (extendedDayjs(curr[0], "YYYY-MM-DD").isValid()) {
        let amount;
        if (curr[2] === "Money Out") {
          amount = parseFloat(curr?.at(-1) ?? "0") * -1;
        } else {
          amount = parseFloat(curr?.at(-1) ?? "0");
        }

        const cleanDescription = curr[5].trimEnd();

        const parsedDescription = parseDBSNAVDescription(cleanDescription);

        prev.push({
          date: formatTransactionDate(curr[0], "DD-MMM-YYYY") ?? "",
          currency: "SGD",
          description: cleanDescription,
          amount,
          transactionCode: curr[1],
          parentTag: parsedDescription.parentTag ?? curr[3],
          childTag: curr[4],
          account: parsedDescription.accountNumber,
        });
      }
      return prev;
    },
    []
  );
};

export const parseDBSAppFormat: CSVParser<FinancialTransactionModel> = (
  parsedContent
) => {
  let currency = "SGD";
  return parsedContent.data.reduce(
    (prev: Array<FinancialTransactionView>, curr: Array<string>) => {
      if (curr[0] === "Currency:") {
        currency = curr[1].slice(0, 4);
      }
      if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
        let amount = 0;
        const debitAmt = curr.at(-6)?.trim();
        const creditAmt = curr.at(-5)?.trim();
        if (debitAmt) {
          amount = parseFloat(debitAmt) * -1;
        } else if (creditAmt) {
          amount = parseFloat(creditAmt);
        }
        const description = curr.slice(-4, -1).join(" ");
        const { transactionMethod, transactionType } =
          descriptionToTags(description);
        prev.push({
          transactionDate: formatTransactionDate(curr[0], "DD-MMM-YYYY") ?? "",
          currency,
          description,
          amount,
          transactionMethod: transactionMethod,
          transactionType: transactionType,
          account: "", // to get from top level
          isInternal: false, // false until marked true by user
        });
      }
      return prev;
    },
    []
  );
};

export const parseDBSNAVAppFormat: CSVParser<FinancialTransactionModel> = (
  parsedContent
) => {
  return parsedContent.data.reduce(
    (prev: Array<FinancialTransactionView>, curr: Array<string>) => {
      if (extendedDayjs(curr[0], "YYYY-MM-DD").isValid()) {
        let amount;
        if (curr[2] === "Money Out") {
          amount = parseFloat(curr?.at(-1) ?? "0") * -1;
        } else {
          amount = parseFloat(curr?.at(-1) ?? "0");
        }

        const cleanDescription = curr[5].trimEnd();

        const parsedDescription = parseDBSNAVDescription(cleanDescription);

        prev.push({
          transactionDate: curr[0],
          currency: "SGD",
          description: cleanDescription,
          amount,
          transactionMethod: curr[1],
          transactionType: parsedDescription.parentTag ?? curr[3],
          account: parsedDescription.accountNumber,
          isInternal: false, // false until marked true by user
        });
      }
      return prev;
    },
    []
  );
};
