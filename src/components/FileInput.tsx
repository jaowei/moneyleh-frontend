import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { JSX, Setter } from "solid-js";
import { parsePDF } from "../utils/pdf";

interface FileInputProps {
  dataSetter: Setter<Array<TextItem | TextMarkedContent> | undefined>;
}

export const FileInput = ({ dataSetter }: FileInputProps) => {
  const onDragEnterHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragOverHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) {
      const pdfTextData = await parsePDF(file);
      dataSetter(pdfTextData);
    }
  };

  const handleInputChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const pdfTextData = await parsePDF(file);
      dataSetter(pdfTextData);
    }
  };

  return (
    <div class="flex flex-col w-full h-full max-w-sm">
      <input
        id="file"
        type="file"
        onInput={handleInputChange}
        class="w-[0.1px] h-[0.1px] opacity-0 absolute overflow-hidden -z-1"
        accept=".pdf"
      ></input>
      <div
        class="flex justify-center items-center"
        border="2 dashed cyan-900"
        p="y-4 x-4"
        onDragLeave={onDragEnterHandler}
        onDragOver={onDragOverHandler}
        onDrop={handleDrop}
      >
        <div class="i-radix-icons-file" />
        Drop Files or
        <label
          for="file"
          text="white sm"
          class="min-w-max bg-cyan-900 rounded hover:bg-cyan-700"
          border="~ solid black"
          p="y-0.5 x-1"
          m="l-1"
          cursor="pointer"
        >
          Click to choose
        </label>
      </div>
      <p text="xs red" m="y-1">
        *Supported File Formats: .pdf
      </p>
    </div>
  );
};
