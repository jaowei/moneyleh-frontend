import Papa from "papaparse";
import { RowData } from "../../types";
import { INVALID_FORMAT_ERROR, StatementFormatsEnum } from "../../constants";
import toast from "solid-toast";
import { parseDBSFormat } from "./dbs";

export const parseCSV = async (
  file: File,
  statementFormat: string
): Promise<Array<RowData> | undefined> => {
  const textContent = await file.text();
  const parsedContent = Papa.parse(textContent, { skipEmptyLines: true });
  switch (statementFormat) {
    case StatementFormatsEnum.DBS_ACCOUNT_CSV:
      return parseDBSFormat(parsedContent);
    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};
