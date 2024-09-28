import { createSignal, JSX, Match, Switch } from "solid-js";
import { ExcelFileParser } from "~/lib/parsers";
import { FileInput } from "./FileInput";
import { SheetSelection } from "./SheetSelection";
import { WorkBook } from "xlsx";
import { Mapping } from "./Mapping";

const increment = (prev: number) => prev + 1;
const decrement = (prev: number) => prev - 1;

export const Migrations = () => {
  const [sequenceIdx, setSequenceIdx] = createSignal(0);
  const [sheetNames, setSheetNames] = createSignal<string[]>([]);
  const [sheets, setSheets] = createSignal<WorkBook["Sheets"]>({});

  const handleInputChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const workbook = await ExcelFileParser.readFile(file);
    setSheetNames(workbook.SheetNames);
    setSheets(workbook.Sheets);
    setSequenceIdx(increment);
  };

  const handleContinue = () => {
    setSequenceIdx(increment);
  };

  const handleBack = () => {
    setSequenceIdx(decrement);
  };

  return (
    <main class="h-full">
      <Switch fallback={<div>An error occurred</div>}>
        <Match when={sequenceIdx() === 0}>
          <FileInput onFileInputChange={handleInputChange} />
        </Match>
        <Match when={sequenceIdx() === 1}>
          <SheetSelection
            sheetNames={sheetNames()}
            sheets={sheets()}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        </Match>
        <Match when={sequenceIdx() === 2}>
          <Mapping
            sheetNames={sheetNames()}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        </Match>
      </Switch>
    </main>
  );
};
