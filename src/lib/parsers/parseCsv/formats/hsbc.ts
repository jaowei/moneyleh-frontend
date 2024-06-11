import { RowData } from "../../../../types";
import { formatTransactionDate } from "../../../../utils/dayjs";
import { descriptionToTags } from "../../description";

export const parseHSBCFormat = (
  parsedContent: Papa.ParseResult<any>
): Array<RowData> => {
  return parsedContent.data.map((data: string[]) => {
    const description = data[1];
    const { transactionMethod, transactionType, transactionSubType } =
      descriptionToTags(description);
    return {
      date: formatTransactionDate(data[0], "DD/M/YYYY") ?? "",
      currency: "SGD",
      description,
      amount: parseFloat(data[2]) * -1,
      transactionCode: transactionMethod,
      parentTag: transactionType,
      childTag: transactionSubType,
    };
  });
};
