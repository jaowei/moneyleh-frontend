import { RowData } from "../../../../types";
import { descriptionToTags } from "../../description";

export const parseHSBCFormat = (
  parsedContent: Papa.ParseResult<any>
): Array<RowData> => {
  return parsedContent.data.map((data: string[]) => {
    const description = data[1];
    const { transactionMethod, transactionType, transactionSubType } =
      descriptionToTags(description);
    return {
      date: data[0],
      currency: "SGD",
      description,
      amount: parseFloat(data[2]) * -1,
      transactionCode: transactionMethod,
      parentTag: transactionType,
      childTag: transactionSubType,
    };
  });
};
