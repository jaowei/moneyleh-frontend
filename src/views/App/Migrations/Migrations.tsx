import { JSX } from "solid-js";
import { FileUploadLogo } from "~/components/FileUploadLogo";

const DropZone = () => {
  const handleDrop = () => {};
  const handleInputChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = (event) => {
    const file = event.target.files?.[0];
    console.log(file);
  };
  return (
    <div class="h-1/2 w-1/2 flex flex-col justify-center items-center">
      <label
        for="upload"
        class="w-full border-4 border-gray-400 p-10 hover:bg-gray-100"
        onDrop={handleDrop}
      >
        <div class="flex flex-col items-center gap-4">
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
        accept=".xls,.xlsx"
      />
    </div>
  );
};

export const Migrations = () => {
  return (
    <main class="flex justify-center items-center h-full">
      <DropZone />
    </main>
  );
};
