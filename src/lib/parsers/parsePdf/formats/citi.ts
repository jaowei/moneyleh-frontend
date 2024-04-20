import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { RowData } from "../../../../types";
import { extendedDayjs } from "../../../../utils/dayjs";
import { PDFParser, isTextItem } from "../parsePdf.types";
import { FinancialTransactionModel } from "../../../storage";
import { isInSameRow } from "../../utils";

const getYear = (text: string, row: string[]): string => {
  if (text.includes("Statement Date")) {
    return row.slice(-4).join("");
  }
  return "";
};

const isValidCitiRow = (row: string[], headerCoord: number): boolean => {
  if (!headerCoord || row.length === 1) {
    return false;
  }
  if (row.length > 6) {
    const text = row.join("");
    const date = text.slice(0, 6);
    if (!extendedDayjs(date, "DD MMM").isValid()) {
      return false;
    }
  }
  return true;
};

const extractDate = (row: string, year: string) => {
  return year ? row.slice(0, 6) + " " + year : row.slice(0, 6);
};

const extractAmountAndDescription = (row: string) => {
  const re = /\(?[0-9]+(?:\.[0-9]+)\)?/;
  const matches = re.exec(row);
  const matchedString = matches?.slice(-1)[0];
  let amount = parseFloat(matchedString ?? "0.0");
  if (isNaN(amount)) {
    amount = parseFloat(matchedString?.slice(1, -1)?.[0] ?? "0.0") * -1;
  }

  const desciptionEndIdx = row.indexOf(matchedString ?? "");
  const description = row.slice(6, desciptionEndIdx);

  return { amount, description };
};

const parseDemoRow = (row: string | string[], year: string): RowData => {
  if (Array.isArray(row)) throw new Error("Invalid row type");
  const parsedDate = extractDate(row, year);

  const { amount, description } = extractAmountAndDescription(row);

  return {
    date: parsedDate,
    currency: "SGD",
    description,
    amount,
  };
};

const parseAppRow = (
  row: string | string[],
  year: string
): FinancialTransactionModel => {
  if (Array.isArray(row)) throw new Error("Invalid row type");
  const parsedDate = extractDate(row, year);

  const { amount, description } = extractAmountAndDescription(row);

  return {
    transactionDate: parsedDate,
    currency: "SGD",
    description,
    amount,
    transactionMethodId: "5", // set as card as uob statement is for cards
    transactionTypeId: "1", //  map using pre configured keywords
    transactionSubTypeId: "1", //  map using pre configured keywords
    accountId: "", // to get from top level
    isInternal: false, // false until marked true by user
  };
};

const parseCitiFormat: PDFParser = (textData, rowParser) => {
  let statementYear: string = "";
  let headerCoord = 0;
  let prevIdx: number = 0;
  let row: Array<string> = [];
  let result: Array<RowData> = [];

  for (let i = 0; i < textData.length; i++) {
    const prevData = textData[prevIdx];
    const data = textData[i];
    if (!isTextItem(data) || !isTextItem(prevData)) continue;

    const currentCoord = data.transform[5];
    const prevCoord = prevData.transform[5];
    const rowString = row.join("");
    const text = data.str;

    if (rowString === "GRAND TOTAL") break;

    if (isInSameRow(prevCoord, currentCoord)) {
      row.push(text);
    } else {
      if (row.length > 50) {
        row = [text];
        continue;
      }
      if (rowString.includes("BALANCE PREVIOUS STATEMENT")) {
        headerCoord = currentCoord;
      }
      if (!statementYear) statementYear = getYear(rowString, row);
      if (isValidCitiRow(row, headerCoord)) {
        const parsedData = rowParser?.(rowString, statementYear);
        result.push(parsedData);
      }
      row = [text];
    }

    prevIdx = i;
  }

  return result;
};

export const parseCitiDemoFormat = (
  data: Array<TextItem | TextMarkedContent>
) => {
  return parseCitiFormat(data, parseDemoRow);
};

export const parseCitiAppFormat = (
  data: Array<TextItem | TextMarkedContent>
) => {
  return parseCitiFormat(data, parseAppRow);
};
