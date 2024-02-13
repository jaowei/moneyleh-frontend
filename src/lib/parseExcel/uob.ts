import { WorkBook, utils } from "xlsx";
import { RowData } from "../../types";
import { extendedDayjs } from "../../utils/dayjs";

export const parseUOBFormat = (workbook: WorkBook): Array<RowData> => {
  const parsedContent = utils.sheet_to_json<any>(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: 1 }
  );
  return parsedContent.reduce((prev: Array<RowData>, curr: Array<string>) => {
    if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
      prev.push({
        date: curr[0],
        description: curr[2],
        amount: parseFloat(curr?.at(-1) ?? "0"),
      });
    }
    return prev;
  }, []);
};
