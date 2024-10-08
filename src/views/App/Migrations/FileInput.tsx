import { JSX } from "solid-js";
import { FileUploadLogo } from "~/components/FileUploadLogo";

interface DropZoneProps {
  onFileInputChange: JSX.ChangeEventHandler<HTMLInputElement, Event>;
}

export const FileInput = (props: DropZoneProps) => {
  const handleDrop = () => {};
  return (
    <div class="flex justify-center items-center h-screen">
      <div class="h-2/3 w-1/2 flex flex-col justify-center items-center">
        <label
          for="upload"
          class="w-full h-full rounded-xl border-4 border-gray-400 p-10 hover:bg-gray-100"
          onDrop={handleDrop}
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
          onChange={(e) => props.onFileInputChange(e)}
          accept=".xls,.xlsx"
        />
      </div>
    </div>
  );
};
