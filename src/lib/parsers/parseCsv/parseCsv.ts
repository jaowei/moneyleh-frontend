import Papa from "papaparse";
import { RowData } from "../../../types";
import { INVALID_FORMAT_ERROR, StatementFormatsEnum } from "../../../constants";
import toast from "solid-toast";
import {
  parseDBSAppFormat,
  parseDBSDemoFormat,
  parseDBSNAVAppFormat,
  parseDBSNAVDemoFormat,
  parseHSBCFormat,
  parseIBKRFormat,
} from "./formats";

export const parseCSV = async (
  file: File,
  statementFormat: string
): Promise<Array<RowData> | undefined> => {
  const textContent = await file.text();
  const parsedContent = Papa.parse(textContent, { skipEmptyLines: true });
  switch (statementFormat) {
    case StatementFormatsEnum.DBS_ACCOUNT:
      return parseDBSDemoFormat(parsedContent);
    case StatementFormatsEnum.HSBC_CARD:
      return parseHSBCFormat(parsedContent);
    case StatementFormatsEnum.IBKR_ACCOUNT:
      return parseIBKRFormat(parsedContent);
    case StatementFormatsEnum.DBS_NAV_ACCOUNT:
      return parseDBSNAVDemoFormat(parsedContent);
    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};

export const CSVFileParser = {
  async decodeFile(file: File) {
    const textContent = await file.text();
    return await this.extractContent(textContent);
  },
  async extractContent(textContent: string) {
    return Papa.parse(textContent, { skipEmptyLines: true });
  },
  async safeParseContent(
    data: Papa.ParseResult<any>,
    parser: (data: Papa.ParseResult<any>) => {}
  ) {
    try {
      return parser(data);
    } catch (error) {
      toast.error(INVALID_FORMAT_ERROR);
      return null;
    }
  },
  demoParsers: {
    [StatementFormatsEnum.DBS_ACCOUNT]: parseDBSDemoFormat,
    [StatementFormatsEnum.HSBC_CARD]: parseHSBCFormat,
    [StatementFormatsEnum.IBKR_ACCOUNT]: parseIBKRFormat,
    [StatementFormatsEnum.DBS_NAV_ACCOUNT]: parseDBSNAVDemoFormat,
  } as Record<string, any>,
  appParsers: {
    [StatementFormatsEnum.DBS_ACCOUNT]: parseDBSAppFormat,
    [StatementFormatsEnum.DBS_NAV_ACCOUNT]: parseDBSNAVAppFormat,
  } as Record<string, any>,
};
