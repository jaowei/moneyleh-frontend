import { extendedDayjs } from "../../utils/dayjs";
import { CSVParser } from "./parseCsv.types";

enum StatementCodeEnum {
  TRANSACTIONS = "TRNT",
  CASH_REPORT = "CRTT",
  CASH_TRANSACTIONS = "CTRN",
  STATEMENT_OF_FUNDS = "STFU",
}

const statementCodes: Array<string> = [
  StatementCodeEnum.TRANSACTIONS,
  StatementCodeEnum.CASH_REPORT,
  StatementCodeEnum.STATEMENT_OF_FUNDS,
];

const handleStatementCode = (
  curr: Array<string>,
  currentCode: string | null | undefined
) => {
  const isValidStatementCode = statementCodes.includes(curr[1]);
  if (curr[0] === "BOS" && isValidStatementCode) {
    return curr[1];
  }
  if (curr[0] === "EOS" && isValidStatementCode) {
    return null;
  }
  return currentCode;
};

const mapTableHeader = (curr: Array<string>, targetHeaders: Array<string>) => {
  const map = new Map();
  for (let target of targetHeaders) {
    map.set(target, curr.indexOf(target));
  }
  return map;
};

const convertDateFormat = (date: string) => {
  return extendedDayjs(date).format("DD/MM/YYYY");
};

export const parseIBKRFormat: CSVParser = (parsedContent) => {
  console.log(parsedContent);
  let currentStatementCode: string | null | undefined;
  let tableHeaderMap: Map<string, number>;
  return parsedContent.data.reduce((prev: Array<any>, curr: Array<string>) => {
    currentStatementCode = handleStatementCode(curr, currentStatementCode);
    if (curr.length === 3) return prev;
    switch (currentStatementCode) {
      case StatementCodeEnum.STATEMENT_OF_FUNDS:
        if (!tableHeaderMap.size) {
          tableHeaderMap = mapTableHeader(curr, [
            "Date",
            "CurrencyPrimary",
            "ActivityDescription",
            "Amount",
          ]);
        } else {
          prev.push({
            date: convertDateFormat(curr[tableHeaderMap.get("Date") ?? 0]),
            currency: curr[tableHeaderMap.get("CurrencyPrimary") ?? 0],
            description: curr[tableHeaderMap.get("ActivityDescription") ?? 0],
            amount: parseFloat(curr[tableHeaderMap.get("Amount") ?? 0]),
          });
        }
        break;
      default:
        break;
    }
    if (!currentStatementCode) {
      tableHeaderMap = new Map();
    }
    return prev;
  }, []);
};
