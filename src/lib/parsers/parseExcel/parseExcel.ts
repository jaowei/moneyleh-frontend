import { RowData } from "../../../types";
import { INVALID_FORMAT_ERROR, StatementFormats } from "../../../constants";
import toast from "solid-toast";
import { WorkBook, read, utils } from "xlsx";
import { appUOBFormat, demoUOBFormat, parseUOBFormat } from "./uob";

// To Deprecate
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
    case StatementFormats.UOB_CARD:
      return parseUOBFormat(workbook);
    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};

export const ExcelFileParser = {
  async decodeFile(file: File) {
    const workbook = read(await file.arrayBuffer());
    const numSheets = workbook.SheetNames.length;
    if (numSheets == 0) {
      toast.error("No sheets detected");
    }
    return await this.extractContent(workbook);
  },
  async extractContent(workbook: WorkBook) {
    return utils.sheet_to_json<any>(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
    });
  },
  async safeParseContent(data: Array<any>, parser: (data: Array<any>) => {}) {
    try {
      return parser(data);
    } catch (error) {
      toast.error(INVALID_FORMAT_ERROR);
      return null;
    }
  },
  demoParsers: {
    [StatementFormats.UOB_CARD]: demoUOBFormat,
  } as Record<string, any>,
  appParsers: {
    [StatementFormats.UOB_CARD]: appUOBFormat,
  } as Record<string, any>,
};
