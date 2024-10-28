import { JSX } from "solid-js";
import { FileInput } from "~/components";

interface DropZoneProps {
  onFileInputChange: JSX.ChangeEventHandler<HTMLInputElement, Event>;
}

export const MigrationsFileInput = (props: DropZoneProps) => {
  const handleDrop = () => {};
  return (
    <FileInput
      onFileDrop={handleDrop}
      onFileInputChange={props.onFileInputChange}
      fileInputAccept=".xls,.xlsx"
    />
  );
};
