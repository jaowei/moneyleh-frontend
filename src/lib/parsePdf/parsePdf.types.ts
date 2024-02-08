import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { RowData } from "../../types";

export const isTextItem = (
  item: TextItem | TextMarkedContent
): item is TextItem => {
  return (item as TextItem).width !== undefined;
};

export type PDFParser = (
  textData: Array<TextItem | TextMarkedContent>
) => Array<RowData>;
