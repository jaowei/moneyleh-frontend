import { RowData } from "../../types";
import { extendedDayjs } from "../../utils/dayjs";

export const parseDBSFormat = (
  parsedContent: Papa.ParseResult<any>
): Array<RowData> => {
  return parsedContent.data.reduce(
    (prev: Array<RowData>, curr: Array<string>) => {
      if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
        let amount = 0;
        if (curr[2].trim()) {
          amount = parseFloat(curr[2].trim()) * -1;
        } else if (curr[3].trim()) {
          amount = parseFloat(curr[3].trim());
        }
        prev.push({
          date: curr[0],
          description: curr.slice(-4, -1).join(" "),
          amount,
        });
      }
      return prev;
    },
    []
  );
};
