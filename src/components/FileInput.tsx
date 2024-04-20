import {
  Accessor,
  JSX,
  Setter,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { ParsedResult } from "../types";
import {
  ACCEPTED_FILE_TYPES,
  AcceptedMIMETypesEnum,
  FILE_PROCESSING_ERROR,
  INVALID_FORMAT_ERROR,
} from "../constants";
import toast from "solid-toast";
import { CSVFileParser, ExcelFileParser, PDFFileParser } from "../lib/parsers";
import { useLocation } from "@solidjs/router";

interface FileInputProps<T> {
  dataSetter: Setter<ParsedResult<T> | undefined>;
  docFormat: Accessor<string>;
  password: Accessor<string | undefined>;
  passwordDialogTriggerSetter: Setter<boolean>;
  passwordSetter: Setter<string | undefined>;
}

export function FileInput<T>(props: FileInputProps<T>) {
  const [fileName, setFileName] = createSignal("No file selected");
  const [savedFile, setSavedFile] = createSignal<File>();

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

  createEffect(() => {
    const file = savedFile();
    if (file && props.password()) {
      handleFileType(file);
      setSavedFile();
      props.passwordSetter();
    }
  });

  const onDragEnterHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragOverHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleFileType = async (file: File | undefined) => {
    try {
      let rowData;
      switch (file?.type) {
        case AcceptedMIMETypesEnum.PDF:
          const fileDataPDF = await PDFFileParser.decodeFile(
            file,
            props.password()
          );
          const fileParserPDF =
            parsers()[AcceptedMIMETypesEnum.PDF][props.docFormat()];
          rowData = await PDFFileParser.safeParseContent(
            fileDataPDF,
            fileParserPDF
          );
          break;
        case AcceptedMIMETypesEnum.CSV:
          const fileDataCSV = await CSVFileParser.decodeFile(file);
          const fileParserCSV =
            parsers()[AcceptedMIMETypesEnum.CSV][props.docFormat()];
          rowData = await CSVFileParser.safeParseContent(
            fileDataCSV,
            fileParserCSV
          );
          break;
        case AcceptedMIMETypesEnum.XLS:
          const fileDataXLS = await ExcelFileParser.decodeFile(file);
          const fileParserXLS =
            parsers()[AcceptedMIMETypesEnum.XLS][props.docFormat()];
          rowData = await ExcelFileParser.safeParseContent(
            fileDataXLS,
            fileParserXLS
          );
          break;
        default:
          toast.error(INVALID_FORMAT_ERROR);
          break;
      }
      if (!rowData) {
        toast.error(FILE_PROCESSING_ERROR);
        return;
      }
      props.dataSetter({ format: props.docFormat(), data: rowData as any });
      setFileName(file?.name ?? "");
    } catch (error: any) {
      if (error?.name === "PasswordException") {
        props.passwordDialogTriggerSetter(true);
        setSavedFile(file);
      }
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    props.dataSetter(undefined);
    setFileName("");
    const file = e.dataTransfer?.files[0];
    handleFileType(file);
  };

  const handleInputChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    props.dataSetter(undefined);
    setFileName("");
    const file = event.target.files?.[0];
    handleFileType(file);
  };

  return (
    <div class="flex flex-col w-full h-full max-w-sm">
      <input
        id="file"
        type="file"
        onInput={handleInputChange}
        class="w-[0.1px] h-[0.1px] opacity-0 absolute overflow-hidden -z-1"
        accept={ACCEPTED_FILE_TYPES}
      />
      <div
        border="2 dashed cyan-900"
        p="y-6 x-4"
        onDragLeave={onDragEnterHandler}
        onDragOver={onDragOverHandler}
        onDrop={handleDrop}
      >
        <div class="flex justify-center items-center">
          <div class="i-radix-icons-file" p="r-2" />
          Drop Files or
          <label
            for="file"
            text="white sm"
            class="min-w-max bg-cyan-900 rounded hover:bg-cyan-700"
            border="~ solid black"
            p="y-1 x-1"
            m="l-1"
            cursor="pointer"
          >
            Click to choose
          </label>
        </div>
        <div class="pt-4 flex justify-center">
          <div font="semibold">{fileName()}</div>
        </div>
      </div>
      <p text="xs red" m="y-1">
        *Supported File Formats: {ACCEPTED_FILE_TYPES}
      </p>
    </div>
  );
}
