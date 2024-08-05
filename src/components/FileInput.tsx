import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

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
  EMPTY_PARSED_RESULT,
  FILE_PROCESSING_ERROR,
  INVALID_FORMAT_ERROR,
} from "../constants";
import toast from "solid-toast";
import { CSVFileParser, ExcelFileParser, PDFFileParser } from "../lib/parsers";
import { useLocation } from "@solidjs/router";
import { formInfo } from "../views/App/DataEntry";
import { Button } from "./Button";

interface FileInputProps<T> {
  dataSetter: Setter<ParsedResult<T>>;
  password: Accessor<string | undefined>;
  passwordDialogTriggerSetter: Setter<boolean>;
  passwordSetter: Setter<string | undefined>;
  docFormat?: Accessor<string | undefined>;
  formInfo?: formInfo;
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
      const format = props?.docFormat?.() || props?.formInfo?.docFormat;
      if (!format) throw new Error();
      switch (file?.type) {
        case AcceptedMIMETypesEnum.PDF:
          const fileDataPDF = await PDFFileParser.decodeFile(
            file,
            props.password()
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
          break;
      }
      if (!rowData) {
        toast.error(FILE_PROCESSING_ERROR);
        return;
      }
      props.dataSetter({ format, data: rowData as any });
      setFileName(file?.name ?? "");
    } catch (error: any) {
      if (error?.name === "PasswordException") {
        props.passwordDialogTriggerSetter(true);
        setSavedFile(file);
      }
      toast.error(FILE_PROCESSING_ERROR);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    props.dataSetter(EMPTY_PARSED_RESULT);
    setFileName("");
    const file = e.dataTransfer?.files[0];
    handleFileType(file);
  };

  const handleInputChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    props.dataSetter(EMPTY_PARSED_RESULT);
    setFileName("");
    const file = event.target.files?.[0];
    handleFileType(file);
  };

  return (
    <div class="flex flex-col">
      <input
        id="file"
        type="file"
        onInput={handleInputChange}
        class="w-[0.1px] h-[0.1px] opacity-0 absolute overflow-hidden -z-1"
        accept={ACCEPTED_FILE_TYPES}
      />
      <div
        class="rounded-xl"
        border="2 dashed cyan-900"
        p="y-6 x-4"
        onDragLeave={onDragEnterHandler}
        onDragOver={onDragOverHandler}
        onDrop={handleDrop}
      >
        <div class="flex justify-center items-center gap-2">
          <div class="i-radix-icons-file" p="r-2" />
          Drop Files or
          <Button size="sm">
            <label for="file">Click to choose</label>
          </Button>
        </div>
        <div class="pt-4 flex justify-center">
          <div font="semibold truncate">{fileName()}</div>
        </div>
      </div>
      <p text="xs red" m="y-1">
        *Supported File Formats: {ACCEPTED_FILE_TYPES}
      </p>
    </div>
  );
}
