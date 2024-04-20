import * as pdfjsLib from "pdfjs-dist";
import toast from "solid-toast";
import { INVALID_FORMAT_ERROR, StatementFormatsEnum } from "../../../constants";
import { isTextItem } from "./parsePdf.types";
import {
  parseCitiAppFormat,
  parseCitiDemoFormat,
  parseDBSAppFormat,
  parseDBSDemoFormat,
  parseMoomooFormat,
  parseSyfePDF,
} from "./formats";

const extractContent = async (doc: pdfjsLib.PDFDocumentProxy, sort = false) => {
  const result = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const pageTextContent = await page.getTextContent();
    if (sort) {
      pageTextContent.items.sort((a, b) => {
        if (!isTextItem(a) || !isTextItem(b)) return 0;
        return b.transform[5] - a.transform[5];
      });
    }
    result.push(...pageTextContent.items);
  }
  return result;
};

export const parsePDF = async (
  file: File,
  layoutType: string,
  password?: string
) => {
  const fileUrl = URL.createObjectURL(file);
  const loadingTask = pdfjsLib.getDocument({ url: fileUrl, password });
  const doc = await loadingTask.promise;

  switch (layoutType) {
    case StatementFormatsEnum.DBS_CARD:
      return parseDBSDemoFormat(await extractContent(doc));

    case StatementFormatsEnum.CITI_CARD:
      return parseCitiDemoFormat(await extractContent(doc));

    case StatementFormatsEnum.MOOMOO_ACCOUNT:
      return parseMoomooFormat(await extractContent(doc));

    case StatementFormatsEnum.SYFE_ACCOUNT:
      return parseSyfePDF(await extractContent(doc));
    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};

export const PDFFileParser = {
  async decodeFile(file: File, password?: string) {
    const fileUrl = URL.createObjectURL(file);
    const loadingTask = pdfjsLib.getDocument({ url: fileUrl, password });
    const doc = await loadingTask.promise;
    return await this.extractContent(doc);
  },
  async extractContent(doc: pdfjsLib.PDFDocumentProxy, sort = false) {
    const result = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const pageTextContent = await page.getTextContent();
      if (sort) {
        pageTextContent.items.sort((a, b) => {
          if (!isTextItem(a) || !isTextItem(b)) return 0;
          return b.transform[5] - a.transform[5];
        });
      }
      result.push(...pageTextContent.items);
    }
    return result;
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
    [StatementFormatsEnum.DBS_CARD]: parseDBSDemoFormat,
    [StatementFormatsEnum.CITI_CARD]: parseCitiDemoFormat,
    [StatementFormatsEnum.MOOMOO_ACCOUNT]: parseMoomooFormat,
    [StatementFormatsEnum.SYFE_ACCOUNT]: parseSyfePDF,
  } as Record<string, any>,
  appParsers: {
    [StatementFormatsEnum.DBS_CARD]: parseDBSAppFormat,
    [StatementFormatsEnum.CITI_CARD]: parseCitiAppFormat,
  } as Record<string, any>,
};
