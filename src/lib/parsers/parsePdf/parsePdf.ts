import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

import { StatementFormats } from "../../../constants";
import { PDFParserData, isTextItem } from "./parsePdf.types";
import {
  isDBSCardFormat,
  parseCitiAppFormat,
  parseDBSAppFormat,
} from "./formats";

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
  async determineParser(data: PDFParserData) {
    if (isDBSCardFormat(data.textData)) {
      return this.appParsers[StatementFormats.DBS_CARD];
    }
  },
  async safeParseContent(data: PDFParserData) {
    try {
      const parser = await this.determineParser(data);
      return parser(data);
    } catch (error) {
      return null;
    }
  },
  appParsers: {
    [StatementFormats.DBS_CARD]: parseDBSAppFormat,
    [StatementFormats.CITI_CARD]: parseCitiAppFormat,
  } as Record<string, any>,
};
