import { RowData } from "../../../../types";
import { extendedDayjs } from "../../../../utils/dayjs";
import {
  PDFParser,
  PDFParserData,
  RowParserData,
  isTextItem,
} from "../parsePdf.types";
import { FinancialTransactionModel } from "../../../storage";
import {
  accountTypeConverter,
  isInSameRow,
  mapToFinancialTransaction,
} from "../../utils";
import { descriptionToTags } from "../../description";

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

const parseDemoRow = (data: RowParserData): RowData => {
  const { row, year } = data;
  const parsedAmount = extractAmount(row);

  const date = extractDate(row, year);

  const description = row.at(1) ?? "";

  const { transactionMethod, transactionType, transactionSubType } =
    descriptionToTags(description);

  return {
    date: date ?? "",
    currency: "SGD",
    description,
    amount: parsedAmount,
    transactionCode: transactionMethod,
    parentTag: transactionType,
    childTag: transactionSubType,
  };
};

const parseAppRow = (data: RowParserData): FinancialTransactionModel => {
  const { row, year, accountId, accountType } = data;
  const parsedAmount = extractAmount(row);

  const date = extractDate(row, year);

  const description = row.at(1) ?? "";

  const { transactionMethod, transactionType, transactionSubType } =
    descriptionToTags(description);

  const method = transactionMethod || accountTypeConverter(accountType);

  return mapToFinancialTransaction({
    transactionDate: date ?? "",
    currency: "SGD",
    description: row.at(1) ?? "",
    amount: parsedAmount,
    transactionMethodId: method,
    transactionTypeId: transactionType,
    transactionSubTypeId: transactionSubType,
    accountId: accountId ?? "",
    isInternal: false, // false until marked true by user
  });
};

const parseDBSFormat: PDFParser = (data, rowParser) => {
  const { textData, accountId, accountType } = data;
  if (!textData) return [];
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
        const parsedData = rowParser?.({
          row,
          year: statementYear,
          accountId,
          accountType,
        });
        result.push(parsedData);
      }
      row = [text];
    }

    prevIdx = i;
  }

  return result;
};

export const parseDBSDemoFormat = (data: PDFParserData) => {
  return parseDBSFormat(data, parseDemoRow);
};

export const parseDBSAppFormat = (data: PDFParserData) => {
  return parseDBSFormat(data, parseAppRow);
};
