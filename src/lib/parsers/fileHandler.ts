import toast from "solid-toast";
import { AcceptedMIMETypesEnum, INVALID_FORMAT_ERROR } from "~/constants";
import { CSVFileParser } from "./parseCsv";
import { ExcelFileParser } from "./parseExcel";
import { PDFFileParser } from "./parsePdf";

export const routeToParsers = async (
  file: File | undefined,
  filePassword: string | undefined,
  accountId: string | undefined,
  accountType: string | undefined
) => {
  let rowData;
  switch (file?.type) {
    case AcceptedMIMETypesEnum.PDF:
      const fileDataPDF = await PDFFileParser.decodeFile(file, filePassword);
      rowData = await PDFFileParser.safeParseContent({
        textData: fileDataPDF,
        accountId: accountId,
        accountType: accountType,
      });
      break;
    case AcceptedMIMETypesEnum.CSV:
      const fileDataCSV = await CSVFileParser.decodeFile(file);
      rowData = await CSVFileParser.safeParseContent(fileDataCSV);
      break;
    case AcceptedMIMETypesEnum.XLS:
      const fileDataXLS = await ExcelFileParser.decodeFile(file);
      rowData = await ExcelFileParser.safeParseContent(fileDataXLS);
      break;
    default:
      toast.error(INVALID_FORMAT_ERROR);
      return;
  }
  return rowData;
};
