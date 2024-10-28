import { INVALID_FORMAT_ERROR, StatementFormats } from "../../../constants";
import toast from "solid-toast";
import { WorkBook, read, utils } from "xlsx";
import { appUOBFormat, isUOBCardFormat } from "./uob";

export const ExcelFileParser = {
  async readFile(file: File) {
    return read(await file.arrayBuffer(), { cellDates: true });
  },
  async decodeFile(file: File) {
    const workbook = await this.readFile(file);
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
  async determineParser(data: Array<any>) {
    if (isUOBCardFormat(data)) {
      return this.appParsers[StatementFormats.UOB_CARD];
    }
  },
  async safeParseContent(data: Array<any>) {
    try {
      const parser = await this.determineParser(data);
      return parser(data);
    } catch (error) {
      toast.error(INVALID_FORMAT_ERROR);
      return null;
    }
  },
  async getSheetNames(file: File) {
    const workbook = await this.readFile(file);
    return workbook.SheetNames;
  },
  appParsers: {
    [StatementFormats.UOB_CARD]: appUOBFormat,
  } as Record<string, any>,
};
