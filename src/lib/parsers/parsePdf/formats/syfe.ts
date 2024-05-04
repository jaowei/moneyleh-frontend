import { extendedDayjs } from "../../../../utils/dayjs";
import { isInSameRow } from "../../utils";
import { PDFParser, isTextItem } from "../parsePdf.types";

const filterTextData = (text: string) => {
  if (!text || text === " ") {
    return true;
  }
  return false;
};

const getYear = (text: string) => {
  const date = extendedDayjs(text, "MMMM YYYY (DD MMM YYYY - DD MMM YYYY)");
  if (date.isValid()) {
    return date.format("YYYY");
  }
  return "";
};

export const parseSyfePDF: PDFParser = (data) => {
  const { textData } = data;
  if (!textData) return [];
  let statementYear: string = "";
  // let headerCoord = 0;
  let prevIdx: number = 0;
  let row: Array<string> = [];
  let result: Array<any> = [];
  for (let i = 0; i < textData.length; i++) {
    const prevData = textData[prevIdx];
    const data = textData[i];
    if (!isTextItem(data) || !isTextItem(prevData)) continue;
    if (filterTextData(data.str)) continue;
    if (!statementYear) {
      statementYear = getYear(data.str);
    }

    const prevCoord = prevData.transform[5];
    const currentCoord = data.transform[5];

    if (isInSameRow(prevCoord, currentCoord)) {
      row.push(data.str);
    } else {
      result.push(row);
      row = [data.str];
    }

    prevIdx = i;
  }
  console.log(result);
  return [];
};
