import { Accessor, JSX, Setter } from "solid-js";
import { parsePDF } from "../lib/parsePdf/parsePdf";
import { parseCSV } from "../lib/parseCsv/parseCsv";
import { RowData } from "../types";
import {
  ACCEPTED_FILE_TYPES,
  AcceptedMIMETypesEnum,
  FILE_PROCESSING_ERROR,
  INVALID_FORMAT_ERROR,
} from "../constants";
import toast from "solid-toast";
import { parseExcel } from "../lib/parseExcel/parseExcel";

interface FileInputProps {
  dataSetter: Setter<Array<RowData> | undefined>;
  fileNameSetter: Setter<string>;
  docFormat: Accessor<string>;
}

export const FileInput = (props: FileInputProps) => {
  const onDragEnterHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragOverHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleFileType = async (file: File | undefined) => {
    let rowData;
    switch (file?.type) {
      case AcceptedMIMETypesEnum.PDF:
        rowData = await parsePDF(file, props.docFormat());
        break;
      case AcceptedMIMETypesEnum.CSV:
        rowData = await parseCSV(file, props.docFormat());
        break;
      case AcceptedMIMETypesEnum.XLS:
        rowData = await parseExcel(file, props.docFormat());
        break;
      default:
        toast.error(INVALID_FORMAT_ERROR);
        break;
    }
    if (!rowData) {
      toast.error(FILE_PROCESSING_ERROR);
      return;
    }
    props.dataSetter(rowData);
    props.fileNameSetter(file?.name ?? "");
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    props.dataSetter(undefined);
    props.fileNameSetter("");
    const file = e.dataTransfer?.files[0];
    handleFileType(file);
  };

  const handleInputChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    props.dataSetter(undefined);
    props.fileNameSetter("");
    const file = event.target.files?.[0];
    console.log(file?.type);
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
        class="flex justify-center items-center"
        border="2 dashed cyan-900"
        p="y-6 x-4"
        onDragLeave={onDragEnterHandler}
        onDragOver={onDragOverHandler}
        onDrop={handleDrop}
      >
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
      <p text="xs red" m="y-1">
        *Supported File Formats: {ACCEPTED_FILE_TYPES}
      </p>
    </div>
  );
};
