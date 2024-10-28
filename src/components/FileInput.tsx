import { JSX } from "solid-js";
import { FileUploadLogo } from "./FileUploadLogo";

interface FileInputProps {
  onFileInputChange: JSX.ChangeEventHandler<HTMLInputElement, Event>;
  fileInputAccept: string;
  onFileDrop: (e: DragEvent) => void;
}

export function FileInput(props: FileInputProps) {
  const onDragEnterHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragOverHandler = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleInputChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = (event) => {
    props.onFileInputChange(event);
  };

  return (
    <div class="flex justify-center items-center h-full">
      <div class="h-2/3 w-1/2 flex flex-col justify-center items-center">
        <label
          for="upload"
          class="w-full h-full rounded-xl border-4 border-gray-400 p-10 hover:bg-gray-100"
          onDragLeave={onDragEnterHandler}
          onDragOver={onDragOverHandler}
          onDrop={(e) => props.onFileDrop(e)}
        >
          <div class="flex flex-col items-center gap-4 h-full">
            <FileUploadLogo />
            <div class="font-bold text-lg">
              Drop files here or click to upload
            </div>
          </div>
        </label>
        <input
          id="upload"
          type="file"
          class="hidden"
          onChange={handleInputChange}
          accept={props.fileInputAccept}
        />
      </div>
    </div>
  );
}
