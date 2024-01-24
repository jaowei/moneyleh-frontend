import * as pdfjsLib from "pdfjs-dist";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { RowData } from "../components";

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

export const sendPDFText = async (
  PDFTextData: Array<TextItem | TextMarkedContent>,
  layoutType: string
): Promise<Array<RowData>> => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_BASE_URL
      }/transactions/file/pdf/layout/${layoutType}/parse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: PDFTextData }),
      }
    );
    return await response.json();
  } catch (error) {
    throw error;
  }
};
