import { TextItem } from "pdfjs-dist/types/src/display/api";
import { PDFParser, isTextItem } from "./parsePdf.types";
import { isInSameRow } from "./utils";
import { extendedDayjs } from "../../utils/dayjs";

const filterTextData = (text: string): boolean => {
  if (!text || text === " ") {
    return true;
  }
  return false;
};

const extractMonth = (targetString: string) => {
  return extendedDayjs(targetString, "MMM YYYY").isValid()
    ? extendedDayjs(targetString, "MMM YYYY")
        .endOf("month")
        .format("DD/MM/YYYY")
    : null;
};

const isValidRowCash = (row: Array<string>) => {
  return extendedDayjs(row[0], "YYYY/MM/DD HH:mm:ss").isValid();
};

const isValidRowPositionValues = (row: Array<string>) => {
  return row.length > 8 && !isNaN(parseFloat(row.slice(-1)[0]));
};

const convertSign = (targetString: string) => {
  let amount;
  const formattedString = targetString.replace(",", "");
  if (formattedString.at(0) === "-") {
    amount = -1 * parseFloat(formattedString.slice(1));
  } else if (formattedString.at(0) === "+") {
    amount = parseFloat(formattedString.slice(1));
  } else {
    amount = parseFloat(formattedString);
  }
  return amount;
};

const parseRowCash = (row: Array<string>) => {
  const formattedAmt = row[2].replace(",", "");
  const amount = convertSign(formattedAmt);
  return {
    date: extendedDayjs(row[0]).format("DD/MM/YYYY"),
    currency: "SGD",
    description: row[1],
    amount,
  };
};

const parseRowPositionValues = (row: Array<string>, endDate: string) => {
  const amount = convertSign(row.at(-5) ?? "0");
  return {
    date: endDate,
    currency: row.at(-12) ?? "N/A",
    description: `Mark to market of ${row.slice(0, 2).join("")}`,
    amount,
  };
};

export const parseMoomooFormat: PDFParser = (textData) => {
  let row: Array<string> = [];
  let result = [];
  let startKey;

  const documentSections: Record<string, Array<TextItem>> = {
    "Changes in Net Asset Value": [],
    "Changes in Position Value": [],
    "Changes in Cash": [],
    "Trades - Funds": [],
    "Ending Positions": [],
  };

  // segregate document into its sections
  for (let i = 0; i < textData.length; i++) {
    const data = textData[i];
    if (!isTextItem(data)) continue;

    if (filterTextData(data.str)) continue;

    if (documentSections[data.str]) {
      startKey = data.str;
    }

    if (startKey) {
      documentSections[startKey].push(data);
    }
  }

  let splitTableCoord;
  let prevIdx: number = 0;

  for (let i = 0; i < documentSections["Changes in Cash"].length; i++) {
    const prevTextItem = documentSections["Changes in Cash"][prevIdx];
    const textItem = documentSections["Changes in Cash"][i];
    if (textItem.str === "Date/Time" && !splitTableCoord) {
      splitTableCoord = textItem.transform[4];
    }

    if (textItem.transform[4] < splitTableCoord || !splitTableCoord) continue;

    const prevCoord = prevTextItem.transform[5];
    const currentCoord = textItem.transform[5];

    if (isInSameRow(prevCoord, currentCoord)) {
      row.push(textItem.str);
    } else {
      if (isValidRowCash(row)) {
        const parsedRow = parseRowCash(row);
        result.push(parsedRow);
      }
      row = [textItem.str];
    }

    prevIdx = i;
  }

  let endOfMonth;
  prevIdx = 0;
  for (
    let i = 0;
    i < documentSections["Changes in Position Value"].length;
    i++
  ) {
    const prevTextItem = documentSections["Changes in Position Value"][prevIdx];
    const textItem = documentSections["Changes in Position Value"][i];

    const prevCoord = prevTextItem.transform[5];
    const currentCoord = textItem.transform[5];

    if (!endOfMonth) {
      endOfMonth = extractMonth(textItem.str);
    }

    if (isInSameRow(prevCoord, currentCoord)) {
      row.push(textItem.str);
    } else {
      if (isValidRowPositionValues(row) && endOfMonth) {
        const parsedRow = parseRowPositionValues(row, endOfMonth);
        result.push(parsedRow);
      }
      row = [textItem.str];
    }

    prevIdx = i;
  }

  return result;
};
