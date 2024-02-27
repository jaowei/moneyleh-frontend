import { RowData } from "../../types";
import { extendedDayjs } from "../../utils/dayjs";
import { PDFParser, isTextItem } from "./parsePdf.types";
import { isInSameRow } from "./utils";

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

const parseRow = (rowString: string, year: string): RowData => {
  const parsedDate = year
    ? rowString.slice(0, 6) + " " + year
    : rowString.slice(0, 6);

  const re = /\(?[0-9]+(?:\.[0-9]+)\)?/;
  const matches = re.exec(rowString);
  const matchedString = matches?.slice(-1)[0];
  let amount = parseFloat(matchedString ?? "0.0");
  if (isNaN(amount)) {
    amount = parseFloat(matchedString?.slice(1, -1)?.[0] ?? "0.0") * -1;
  }

  const desciptionEndIdx = rowString.indexOf(matchedString ?? "");
  const description = rowString.slice(6, desciptionEndIdx);

  return {
    date: parsedDate,
    currency: "SGD",
    description,
    amount,
  };
};

export const parseCitiFormat: PDFParser = (textData) => {
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
      console.log(rowString, statementYear);
      if (isValidCitiRow(row, headerCoord)) {
        const parsedData = parseRow(rowString, statementYear);
        result.push(parsedData);
      }
      row = [text];
    }

    prevIdx = i;
  }

  return result;
};
