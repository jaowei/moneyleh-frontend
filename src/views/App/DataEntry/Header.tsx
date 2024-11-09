import { Button } from "~/components/ui/button";
import { formInfo } from "./DataEntry";
import { Badge } from "~/components/ui/badge";
import { createSignal } from "solid-js";
import { TagDialog } from "../common/TagDialog";

interface HeaderProps {
  fileName: string;
  onSaveClick: () => void;
  onCopyClick: () => void;
  onExportClick: () => void;
  isDisabled: boolean;
  formInfo: formInfo;
}

export const Header = (props: HeaderProps) => {
  const [tagDialogIsOpen, setTagDialogIsOpen] = createSignal(false);
  const handleTagsClick = () => {
    setTagDialogIsOpen((prev) => !prev);
  };
  return (
    <div class="flex flex-row justify-between items-center p-2 bg-gray-100">
      <div class="flex flex-row gap-2 items-center">
        <Badge class="w-max">{props.fileName}</Badge>
        <span class="iconify radix-icons--arrow-right w-[32px]" />
        <Badge class="w-max">
          {props.formInfo.name.length
            ? props.formInfo.name
            : "No account selected"}
        </Badge>
      </div>
      <div class="flex flex-row gap-2">
        <Button
          size="sm"
          onClick={props.onCopyClick}
          disabled={props.isDisabled}
        >
          Copy
        </Button>
        <Button
          size="sm"
          onClick={props.onExportClick}
          disabled={props.isDisabled}
        >
          Export as CSV
        </Button>
        <Button size="sm" onClick={handleTagsClick}>
          Tags
        </Button>
        {/* <Button size="sm" onClick={handleTagsClick}>
          Entities
        </Button> */}
        <Button
          size="sm"
          variant="special"
          disabled={props.isDisabled}
          onClick={props.onSaveClick}
        >
          Save
        </Button>
      </div>
      <TagDialog
        isOpen={tagDialogIsOpen}
        onDialogOpenChange={setTagDialogIsOpen}
      />
    </div>
  );
};
