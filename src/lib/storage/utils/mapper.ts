import { formInformation } from "../../../views/App/AppDataEntry";
import { FinancialTransactionModel } from "../sql";

export const financialTransactionsMapper = (
  data: FinancialTransactionModel[],
  databaseInfo: formInformation,
  accountId: string
) => {
  for (let row of data) {
    row.$accountId = accountId;

    const methodArr = databaseInfo.transactionMethods.filter((method) => {
      return method.includes(row.$transactionMethodId);
    });
    row.$transactionMethodId =
      methodArr?.[0]?.[0]?.toString() ?? row.$transactionMethodId;

    const typeArr = databaseInfo.transactionTypes.filter((type) => {
      return type.includes(row.$transactionTypeId);
    });
    row.$transactionTypeId =
      typeArr?.[0]?.[0]?.toString() ?? row.$transactionTypeId;

    const subTypeArr = databaseInfo.transactionSubTypes.filter((subType) => {
      return subType.includes(row.$transactionSubTypeId ?? "");
    });
    row.$transactionSubTypeId =
      subTypeArr?.[0]?.[0]?.toString() ?? row.$transactionSubTypeId;
  }
};
