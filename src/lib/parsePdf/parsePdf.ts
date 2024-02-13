import * as pdfjsLib from "pdfjs-dist";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { INVALID_FORMAT_ERROR, StatementFormatsEnum } from "../../constants";
import { parseDBSFormat } from "./dbs";
import { parseCitiFormat } from "./citi";
import toast from "solid-toast";

export const parsePDF = async (file: File, layoutType: string) => {
  const allPagesTextData: Array<TextItem | TextMarkedContent> = [];
  const fileUrl = URL.createObjectURL(file);
  const loadingTask = pdfjsLib.getDocument(fileUrl);
  const doc = await loadingTask.promise;
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const pageTextContent = await page.getTextContent();
    allPagesTextData.push(...pageTextContent.items);
  }

  switch (layoutType) {
    case StatementFormatsEnum.DBS_CARD_PDF:
      return parseDBSFormat(allPagesTextData);

    case StatementFormatsEnum.CITI_CARD_PDF:
      return parseCitiFormat(allPagesTextData);

    default:
      toast.error(INVALID_FORMAT_ERROR);
      break;
  }
};
