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

const isValidRow = (row: Array<string>) => {
  return extendedDayjs(row[0], "YYYY/MM/DD HH:mm:ss").isValid();
};

const parseRow = (row: Array<string>) => {
  let amount;
  const formattedAmt = row[2].replace(",", "");
  if (row[2].at(0) === "-") {
    amount = -1 * parseFloat(formattedAmt.slice(1));
  } else if (row[2].at(0) === "+") {
    amount = parseFloat(formattedAmt.slice(1));
  } else {
    amount = parseFloat(formattedAmt);
  }

  return {
    date: extendedDayjs(row[0]).format("DD/MM/YYYY"),
    description: row[1],
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
      if (isValidRow(row)) {
        const parsedRow = parseRow(row);
        result.push(parsedRow);
      }
      row = [textItem.str];
    }

    prevIdx = i;
  }

  return result;
};
