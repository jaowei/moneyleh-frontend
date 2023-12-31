import * as pdfjsLib from "pdfjs-dist";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

export const parsePDF = async (file: File) => {
  const allPagesTextData: Array<TextItem | TextMarkedContent> = [];
  const fileUrl = URL.createObjectURL(file);
  const loadingTask = pdfjsLib.getDocument(fileUrl);
  const doc = await loadingTask.promise;
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const pageTextContent = await page.getTextContent();
    allPagesTextData.push(...pageTextContent.items);
  }
  return allPagesTextData;
};
