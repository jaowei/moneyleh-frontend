import Papa from "papaparse";
import { RowData } from "../../types";
import { INVALID_FORMAT_ERROR, StatementFormatsEnum } from "../../constants";
import toast from "solid-toast";
import { parseDBSFormat } from "./dbs";
import { parseHSBCFormat } from "./hsbc";

export const parseCSV = async (
  file: File,
  statementFormat: string
): Promise<Array<RowData> | undefined> => {
  const textContent = await file.text();
  const parsedContent = Papa.parse(textContent, { skipEmptyLines: true });
  switch (statementFormat) {
    case StatementFormatsEnum.DBS_ACCOUNT:
      return parseDBSFormat(parsedContent);
    case StatementFormatsEnum.HSBC_CARD:
      return parseHSBCFormat(parsedContent);
    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};
