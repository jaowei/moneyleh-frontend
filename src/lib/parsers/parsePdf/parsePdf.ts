import * as pdfjsLib from "pdfjs-dist";
import toast from "solid-toast";
import { INVALID_FORMAT_ERROR, StatementFormats } from "../../../constants";
import { PDFParserData, isTextItem } from "./parsePdf.types";
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
  return { textData: result };
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
    case StatementFormats.DBS_CARD:
      return parseDBSDemoFormat(await extractContent(doc));

    case StatementFormats.CITI_CARD:
      return parseCitiDemoFormat(await extractContent(doc));

    case StatementFormats.MOOMOO_ACCOUNT:
      return parseMoomooFormat(await extractContent(doc));

    case StatementFormats.SYFE_ACCOUNT:
      return parseSyfePDF(await extractContent(doc));
    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};

export const PDFFileParser = {
  async decodeFile(file: File, password?: string) {
    try {
      const fileUrl = URL.createObjectURL(file);
      const loadingTask = pdfjsLib.getDocument({ url: fileUrl, password });
      const doc = await loadingTask.promise;
      return await this.extractContent(doc);
    } catch (error) {
      toast.error("Error parsing file...");
    }
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
  async safeParseContent(
    data: PDFParserData,
    parser: (data: PDFParserData) => {}
  ) {
    try {
      return parser(data);
    } catch (error) {
      toast.error(INVALID_FORMAT_ERROR);
      return null;
    }
  },
  demoParsers: {
    [StatementFormats.DBS_CARD]: parseDBSDemoFormat,
    [StatementFormats.CITI_CARD]: parseCitiDemoFormat,
    [StatementFormats.MOOMOO_ACCOUNT]: parseMoomooFormat,
    [StatementFormats.SYFE_ACCOUNT]: parseSyfePDF,
  } as Record<string, any>,
  appParsers: {
    [StatementFormats.DBS_CARD]: parseDBSAppFormat,
    [StatementFormats.CITI_CARD]: parseCitiAppFormat,
  } as Record<string, any>,
};
