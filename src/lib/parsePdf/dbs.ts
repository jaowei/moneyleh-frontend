import { RowData } from "../../types";
import { PDFParser, isTextItem } from "./parsePdf.types";
import * as dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isInSameRow } from "./utils";

dayjs.extend(customParseFormat);

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
  if (dayjs(text, "DD MMM YYYY").isValid()) {
    return text.slice(textLen - 4);
  }
  return "";
};

const parseRow = (row: Array<string>, year: string): RowData => {
  const lastItem = row.at(-1)?.replace(",", "");
  let parsedAmount = parseFloat(lastItem ?? "0.0");
  if (lastItem === "CR") {
    const secondLastItem = row.at(-2)?.replace(",", "");
    parsedAmount = parseFloat(secondLastItem ?? "0.0") * -1;
  }

  const date = year ? row.at(0) + " " + year : row.at(0);

  return {
    date: date ?? "",
    description: row.at(1) ?? "",
    amount: parsedAmount,
  };
};

export const parseDBSFormat: PDFParser = (textData) => {
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
        const parsedData = parseRow(row, statementYear);
        result.push(parsedData);
      }
      row = [text];
    }

    prevIdx = i;
  }

  return result;
};
