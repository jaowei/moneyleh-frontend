import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

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
) => Array<any>;

export const isTextItem = (
  item: TextItem | TextMarkedContent
): item is TextItem => {
  return (item as TextItem).width !== undefined;
};
