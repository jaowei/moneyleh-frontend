import { Button } from "~/components/ui/button";
import { formInfo } from "./DataEntry";
import { Badge } from "~/components/ui/badge";

interface HeaderProps {
  fileName: string;
  onSaveClick: () => void;
  onCopyClick: () => void;
  onExportClick: () => void;
  isDisabled: boolean;
  formInfo: formInfo;
}

export const Header = (props: HeaderProps) => {
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
        <Button onClick={props.onCopyClick} disabled={props.isDisabled}>
          Copy
        </Button>
        <Button onClick={props.onExportClick} disabled={props.isDisabled}>
          Export as CSV
        </Button>
        {/* <Button>Tags</Button> */}
        <Button
          variant="special"
          disabled={props.isDisabled}
          onClick={props.onSaveClick}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
