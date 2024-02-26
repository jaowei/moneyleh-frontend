import * as pdfjsLib from "pdfjs-dist";
import toast from "solid-toast";
import { INVALID_FORMAT_ERROR, StatementFormatsEnum } from "../../constants";
import { parseDBSFormat } from "./dbs";
import { parseCitiFormat } from "./citi";
import { parseMoomooFormat } from "./moomoo";
import { isTextItem } from "./parsePdf.types";

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
      return parseDBSFormat(await extractContent(doc));

    case StatementFormatsEnum.CITI_CARD:
      return parseCitiFormat(await extractContent(doc));

    case StatementFormatsEnum.MOOMOO_ACCOUNT:
      return parseMoomooFormat(await extractContent(doc));

    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};
