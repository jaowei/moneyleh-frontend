import { createSignal, JSX, Match, Switch } from "solid-js";
import { ExcelFileParser } from "~/lib/parsers";
import { FileInput } from "./FileInput";
import { SheetSelection } from "./SheetSelection";

export const Migrations = () => {
  const sequence = ["fileInput", "sheetSelection"];
  const [sequenceIdx, setSequenceIdx] = createSignal(0);
  const [sheetNames, setSheetNames] = createSignal<string[]>([]);
  const handleInputChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const sheetNames = await ExcelFileParser.getSheetNames(file);
    setSheetNames(sheetNames);
    setSequenceIdx((prev) => prev + 1);
  };
  return (
    <main class="flex justify-center items-center h-full">
      <Switch fallback={<div>An error occurred</div>}>
        <Match when={sequenceIdx() === 0}>
          <FileInput onFileInputChange={handleInputChange} />
        </Match>
        <Match when={sequenceIdx() === 1}>
          <SheetSelection sheetNames={sheetNames()} />
        </Match>
      </Switch>
    </main>
  );
};
