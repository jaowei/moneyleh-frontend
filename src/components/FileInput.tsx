import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

import { Accessor, JSX, Setter, createMemo, createSignal } from "solid-js";
import { ParsedResult } from "../types";
import {
  ACCEPTED_FILE_TYPES,
  AcceptedMIMETypesEnum,
  EMPTY_PARSED_RESULT,
  FILE_PROCESSING_ERROR,
  INVALID_FORMAT_ERROR,
} from "../constants";
import toast from "solid-toast";
import { CSVFileParser, ExcelFileParser, PDFFileParser } from "../lib/parsers";
import { useLocation } from "@solidjs/router";
import { formInfo } from "../views/App/DataEntry";
import { Button } from "./ui/button";
import { PasswordDialog } from "./PasswordDialog";

interface FileInputProps<T> {
  dataSetter: Setter<ParsedResult<T>>;
  docFormat?: Accessor<string | undefined>;
  formInfo?: formInfo;
}

const NO_FILE_SELECTED_MSG = "No file selected";

export function FileInput<T>(props: FileInputProps<T>) {
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

  const handlePasswordDialogOpenChange = () => {
    if (!passwordDialogIsOpen()) {
      setPasswordDialogIsOpen(true);
      return;
    }
    setPasswordDialogIsOpen(false);
    if (filePassword()) {
      handleFileType(savedFile());
    } else {
      setFileName(NO_FILE_SELECTED_MSG);
      setSavedFile();
    }
  };

  const handleInputChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = (event) => {
    props.dataSetter(EMPTY_PARSED_RESULT);
    setFileName("");
    const file = event.target.files?.[0];
    setSavedFile(file);
    handleFileType(file, event);
  };

  return (
    <div class="flex flex-col flex-grow w-full">
      <input
        id="file"
        type="file"
        onChange={handleInputChange}
        class="w-[0.1px] h-[0.1px] opacity-0 absolute overflow-hidden -z-1"
        accept={ACCEPTED_FILE_TYPES}
      />
      <div
        class="rounded-xl border-2 border-dashed border-cyan-900 py-2 px-4"
        onDragLeave={onDragEnterHandler}
        onDragOver={onDragOverHandler}
        onDrop={handleDrop}
      >
        <div class="flex justify-center items-center gap-2 text-sm">
          <span class="iconify radix-icons--file" />
          Drop Files or
          <Button size="xs">
            <label for="file">Click to select</label>
          </Button>
        </div>
        <div class="pt-4 flex justify-center">
          <div class="font-semibold font-truncate">{fileName()}</div>
        </div>
      </div>
      <div class="text-xs text-red-500 my-1">
        *Supported File Formats: {ACCEPTED_FILE_TYPES}
      </div>
      <PasswordDialog
        isOpen={passwordDialogIsOpen}
        passwordSetter={setFilePassword}
        onDialogOpenChange={handlePasswordDialogOpenChange}
      />
    </div>
  );
}
