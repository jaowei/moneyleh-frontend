import { RowData } from "../../types";
import { extendedDayjs } from "../../utils/dayjs";

export const parseDBSFormat = (
  parsedContent: Papa.ParseResult<any>
): Array<RowData> => {
  let currency = "SGD";
  return parsedContent.data.reduce(
    (prev: Array<RowData>, curr: Array<string>) => {
      if (curr[0] === "Currency:") {
        currency = curr[1].slice(0, 4);
      }
      if (extendedDayjs(curr[0], "DD MMM YYYY").isValid()) {
        let amount = 0;
        const debitAmt = curr.at(-6)?.trim();
        const creditAmt = curr.at(-5)?.trim();
        if (debitAmt) {
          amount = parseFloat(debitAmt) * -1;
        } else if (creditAmt) {
          amount = parseFloat(creditAmt);
        }
        prev.push({
          date: curr[0],
          currency,
          description: curr.slice(-4, -1).join(" "),
          amount,
        });
      }
      return prev;
    },
    []
  );
};
