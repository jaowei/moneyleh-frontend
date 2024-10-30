import { FinancialTransactionView } from "~/lib/storage";
import { formatTransactionDate } from "../../../../utils/dayjs";
import { descriptionToTags } from "../../description";

export const isHSBCCard = (parseResult: Papa.ParseResult<any>) => {
  return parseResult.data[0][1].includes("•");
};

export const parseHSBCFormat = (
  parsedContent: Papa.ParseResult<any>
): Array<FinancialTransactionView> => {
  return parsedContent.data.map((data: string[]) => {
    const description = data[1];
    const { transactionMethod, transactionType } =
      descriptionToTags(description);
    return {
      transactionDate: formatTransactionDate(data[0], "DD/M/YYYY") ?? "",
      currency: description.slice(-3),
      description,
      amount: parseFloat(data[2]) * -1,
      transactionMethod: transactionMethod,
      transactionType: transactionType,
    };
  });
};
