import Papa from "papaparse";
import { INVALID_FORMAT_ERROR, StatementFormats } from "../../../constants";
import toast from "solid-toast";
import {
  isDBSAccountFormat,
  isHSBCCard,
  parseDBSAppFormat,
  parseDBSNAVAppFormat,
  parseHSBCFormat,
} from "./formats";

export const CSVFileParser = {
  async decodeFile(file: File) {
    const textContent = await file.text();
    return await this.extractContent(textContent);
  },
  async extractContent(textContent: string) {
    return Papa.parse(textContent, { skipEmptyLines: true });
  },
  async determineParser(data: Papa.ParseResult<any>) {
    if (isDBSAccountFormat(data)) {
      return this.appParsers[StatementFormats.DBS_ACCOUNT];
    }
    if (isHSBCCard(data)) {
      return this.appParsers[StatementFormats.HSBC_CARD];
    }
  },
  async safeParseContent(data: Papa.ParseResult<any>) {
    try {
      const parser = await this.determineParser(data);
      return parser(data);
    } catch (error) {
      toast.error(INVALID_FORMAT_ERROR);
      return null;
    }
  },
  appParsers: {
    [StatementFormats.DBS_ACCOUNT]: parseDBSAppFormat,
    [StatementFormats.DBS_NAV_ACCOUNT]: parseDBSNAVAppFormat,
    [StatementFormats.HSBC_CARD]: parseHSBCFormat,
  } as Record<string, any>,
};
