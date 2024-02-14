import { RowData } from "../../types";
import { INVALID_FORMAT_ERROR, StatementFormatsEnum } from "../../constants";
import toast from "solid-toast";
import { read } from "xlsx";
import { parseUOBFormat } from "./uob";

export const parseExcel = async (
  file: File,
  statementFormat: string
): Promise<Array<RowData> | undefined> => {
  const workbook = read(await file.arrayBuffer());
  const numSheets = workbook.SheetNames.length;
  if (numSheets == 0) {
    toast.error("No sheets detected");
  }
  switch (statementFormat) {
    case StatementFormatsEnum.UOB_CARD:
      return parseUOBFormat(workbook);
    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};
