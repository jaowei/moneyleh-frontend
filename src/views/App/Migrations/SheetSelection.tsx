import { createSignal } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface SheetSelectionProps {
  sheetNames: string[];
}

export const SheetSelection = (props: SheetSelectionProps) => {
  const [selectedSheet, setSelectedSheet] = createSignal<string>();
  return (
    <Select
      value={selectedSheet()}
      onChange={setSelectedSheet}
      options={props.sheetNames}
      placeholder="Select a sheet to parse"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger>
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};
