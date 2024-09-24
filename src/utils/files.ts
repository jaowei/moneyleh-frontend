import { useLocation } from "@solidjs/router";
import { createSignal, createMemo } from "solid-js";
import { AcceptedMIMETypesEnum } from "~/constants";
import { CSVFileParser, PDFFileParser, ExcelFileParser } from "~/lib/parsers";

const NO_FILE_SELECTED_MSG = "No file selected";

export const useFileInput = () => {
  const [fileName, setFileName] = createSignal(NO_FILE_SELECTED_MSG);
  const [savedFile, setSavedFile] = createSignal<File>();
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);
  const [filePassword, setFilePassword] = createSignal<string>();

  const location = useLocation();

  const parsers = createMemo(() => {
    if (location.pathname.includes("app")) {
      return {
        [AcceptedMIMETypesEnum.CSV]: CSVFileParser.appParsers,
        [AcceptedMIMETypesEnum.PDF]: PDFFileParser.appParsers,
        [AcceptedMIMETypesEnum.XLS]: ExcelFileParser.appParsers,
      };
    } else {
      return {
        [AcceptedMIMETypesEnum.CSV]: CSVFileParser.demoParsers,
        [AcceptedMIMETypesEnum.PDF]: PDFFileParser.demoParsers,
        [AcceptedMIMETypesEnum.XLS]: ExcelFileParser.demoParsers,
      };
    }
  });

  const onDragEnterHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragOverHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleFileType = async (
    file: File | undefined,
    event?: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) => {
    try {
      let rowData;
      const format = props?.docFormat?.() || props?.formInfo?.docFormat;
      if (!format) throw new Error();
      switch (file?.type) {
        case AcceptedMIMETypesEnum.PDF:
          const fileDataPDF = await PDFFileParser.decodeFile(
            file,
            filePassword()
          );
          const fileParserPDF = parsers()[AcceptedMIMETypesEnum.PDF][format];
          rowData = await PDFFileParser.safeParseContent(
            {
              textData: fileDataPDF,
              accountId: props?.formInfo?.accountId,
              accountType: props?.formInfo?.type,
            },
            fileParserPDF
          );
          break;
        case AcceptedMIMETypesEnum.CSV:
          const fileDataCSV = await CSVFileParser.decodeFile(file);
          const fileParserCSV = parsers()[AcceptedMIMETypesEnum.CSV][format];
          rowData = await CSVFileParser.safeParseContent(
            fileDataCSV,
            fileParserCSV
          );
          break;
        case AcceptedMIMETypesEnum.XLS:
          const fileDataXLS = await ExcelFileParser.decodeFile(file);
          const fileParserXLS = parsers()[AcceptedMIMETypesEnum.XLS][format];
          rowData = await ExcelFileParser.safeParseContent(
            fileDataXLS,
            fileParserXLS
          );
          break;
        default:
          toast.error(INVALID_FORMAT_ERROR);
          return;
      }
      if (!rowData) {
        throw new Error();
      }
      props.dataSetter({ format, data: rowData as any });
      setFileName(file?.name ?? "");
    } catch (error: any) {
      if (error?.name === "PasswordException") {
        setPasswordDialogIsOpen(true);
        setSavedFile(file);
        setFileName(file?.name ?? "");
        return;
      }
      console.log(error);
      toast.error(FILE_PROCESSING_ERROR);
      setSavedFile();
      setFilePassword();
      setFileName(NO_FILE_SELECTED_MSG);
      if (event?.target?.value) {
        event.target.value = "";
      }
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    props.dataSetter(EMPTY_PARSED_RESULT);
    setFileName("");
    const file = e.dataTransfer?.files[0];
    setSavedFile(file);
    handleFileType(file);
  };
};
