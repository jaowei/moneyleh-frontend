import { RowData } from "../../types";

export const parseHSBCFormat = (
  parsedContent: Papa.ParseResult<any>
): Array<RowData> => {
  return parsedContent.data.map((data: string[]) => {
    return {
      date: data[0],
      description: data[1],
      amount: parseFloat(data[2]) * -1,
    } as RowData;
  });
};
