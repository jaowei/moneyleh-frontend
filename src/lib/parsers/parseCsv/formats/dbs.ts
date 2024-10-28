import { extendedDayjs, formatTransactionDate } from "../../../../utils/dayjs";
import {
  CreateFinancialTransactionDto,
  FinancialTransactionView,
} from "../../../storage";
import { descriptionToTags } from "../../description";
import { CSVParser } from "../parseCsv.types";

const keywordsParentTagMap = new Map([
  ["PAYLAH", "Paylah"],
  ["BILL CCC", "Creditcard"],
  ["PayNow", "Paynow"],
]);

export const isDBSAccountFormat = (parseResult: Papa.ParseResult<any>) => {
  const accountDetails = parseResult.data[0][1];
  return accountDetails.includes("DBS");
};

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

export const parseDBSAppFormat: CSVParser<CreateFinancialTransactionDto> = (
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
        });
      }
      return prev;
    },
    []
  );
};

export const parseDBSNAVAppFormat: CSVParser<CreateFinancialTransactionDto> = (
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
        });
      }
      return prev;
    },
    []
  );
};
