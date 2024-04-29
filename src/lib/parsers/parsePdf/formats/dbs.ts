import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { RowData } from "../../../../types";
import { extendedDayjs } from "../../../../utils/dayjs";
import { PDFParser, isTextItem } from "../parsePdf.types";
import { FinancialTransactionModel } from "../../../storage";
import { isInSameRow, mapToFinancialTransaction } from "../../utils";

const filterTextData = (text: string): boolean => {
  if (
    !text ||
    text === " " ||
    text.length > 40 ||
    text.includes("NEW TRANSACTIONS")
  ) {
    return true;
  }
  return false;
};

const getYear = (text: string): string => {
  const textLen = text.length;
  if (extendedDayjs(text, "DD MMM YYYY").isValid()) {
    return text.slice(textLen - 4);
  }
  return "";
};

const extractAmount = (row: Array<string> | string) => {
  const lastItem = row.at(-1)?.replace(",", "");
  let parsedAmount = parseFloat(lastItem ?? "0.0");
  if (lastItem === "CR") {
    const secondLastItem = row.at(-2)?.replace(",", "");
    parsedAmount = parseFloat(secondLastItem ?? "0.0") * -1;
  }
  return parsedAmount;
};

const extractDate = (row: Array<string> | string, year: string) => {
  return year ? row.at(0) + " " + year : row.at(0);
};

const parseDemoRow = (row: Array<string> | string, year: string): RowData => {
  const parsedAmount = extractAmount(row);

  const date = extractDate(row, year);

  return {
    date: date ?? "",
    currency: "SGD",
    description: row.at(1) ?? "",
    amount: parsedAmount,
  };
};

const parseAppRow = (
  row: Array<string> | string,
  year: string
): FinancialTransactionModel => {
  const parsedAmount = extractAmount(row);

  const date = extractDate(row, year);

  return mapToFinancialTransaction({
    transactionDate: date ?? "",
    currency: "SGD",
    description: row.at(1) ?? "",
    amount: parsedAmount,
    transactionMethodId: "5", // set as card as uob statement is for cards
    transactionTypeId: "1", //  map using pre configured keywords
    transactionSubTypeId: "1", //  map using pre configured keywords
    accountId: "", // to get from top level
    isInternal: false, // false until marked true by user
  });
};

const parseDBSFormat: PDFParser = (textData, rowParser) => {
  let statementYear: string = "";
  let headerCoord = 0;
  let prevIdx: number = 0;
  let row: Array<string> = [];
  let result: Array<RowData> = [];

  for (let i = 0; i < textData.length; i++) {
    const prevData = textData[prevIdx];
    const data = textData[i];
    if (!isTextItem(data) || !isTextItem(prevData)) continue;
    const text = data.str;

    if (filterTextData(text)) continue;

    if (!statementYear) statementYear = getYear(text);

    if (text === "PREVIOUS BALANCE") {
      headerCoord = data.transform[5];
    }

    // stops below code from running until header is found
    if (headerCoord === 0) continue;

    // Stop processing
    if (text === "TOTAL:") break;

    const prevCoord = prevData.transform[5];
    const currentCoord = data.transform[5];

    // is in same row
    if (isInSameRow(prevCoord, currentCoord)) {
      row.push(text);
    } else {
      if (row.length >= 3) {
        const parsedData = rowParser?.(row, statementYear);
        result.push(parsedData);
      }
      row = [text];
    }

    prevIdx = i;
  }

  return result;
};

export const parseDBSDemoFormat = (
  data: Array<TextItem | TextMarkedContent>
) => {
  return parseDBSFormat(data, parseDemoRow);
};

export const parseDBSAppFormat = (
  data: Array<TextItem | TextMarkedContent>
) => {
  return parseDBSFormat(data, parseAppRow);
};
