import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { RowData } from "../../../types";

export type PDFParserData = {
  textData?: Array<TextItem | TextMarkedContent>;
  accountType?: string;
  accountId?: string;
};

export type RowParserData = {
  row: Array<string> | string;
  year: string;
  accountType?: string;
  accountId?: string;
};

export type PDFParser = (
  data: PDFParserData,
  rowParser?: (data: RowParserData) => any
) => Array<RowData>;

export const isTextItem = (
  item: TextItem | TextMarkedContent
): item is TextItem => {
  return (item as TextItem).width !== undefined;
};
