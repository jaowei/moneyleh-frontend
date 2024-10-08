import { createSignal, JSX, Match, Switch } from "solid-js";
import { ExcelFileParser } from "~/lib/parsers";
import { FileInput } from "./FileInput";
import { SheetSelection } from "./SheetSelection";
import { WorkBook } from "xlsx";
import { Mapping } from "./Mapping";
import { Preview } from "./Preview";

export interface ColumnMapInfo {
  baseColName: string;
  helperText: string;
  selectedColIdx?: number[];
}

const increment = (prev: number) => prev + 1;
const decrement = (prev: number) => prev - 1;
const selectedColMap: ColumnMapInfo[] = [
  {
    baseColName: "Transaction Date",
    helperText: "Date of the transaction",
  },
  {
    baseColName: "Description",
    helperText: "Description of the transaction, can be multiple columns",
  },
  {
    baseColName: "Amount",
    helperText: "Amount can be positive or negative value of the transaction",
  },
  {
    baseColName: "Currency",
    helperText: "Currency transaction was made in",
  },
  {
    baseColName: "Account",
    helperText: "The account the transaction was made under",
  },
  {
    baseColName: "Entity",
    helperText: "The company that the account is under",
  },
  {
    baseColName: "Transaction Tag",
    helperText:
      "Any useful information that can be used to categorise the transaction",
  },
];

export const Migrations = () => {
  const [sequenceIdx, setSequenceIdx] = createSignal(0);
  const [sheetNames, setSheetNames] = createSignal<string[]>([]);
  const [sheets, setSheets] = createSignal<WorkBook["Sheets"]>({});
  const [selectedCols, setSelectedCols] = createSignal<string[]>([]);
  const [colMap, setColMap] = createSignal(selectedColMap);

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

  const handleSheetSelection = (cols: string[]) => {
    setSelectedCols(cols);
  };

  const handleColMapSelection = (baseIdx: number, selectedIdxs: number[]) => {
    setColMap((prev) => {
      return prev.map((info, idx) => {
        if (idx === baseIdx) {
          return {
            ...info,
            selectedColIdx: selectedIdxs,
          };
        }
        return info;
      });
    });
  };

  return (
    <main class="h-screen">
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
            onSelection={handleSheetSelection}
          />
        </Match>
        <Match when={sequenceIdx() === 2}>
          <Mapping
            colNames={selectedCols()}
            selectedColMap={colMap()}
            onColMapSelection={handleColMapSelection}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        </Match>
        <Match when={sequenceIdx() === 3}>
          <Preview onContinue={handleContinue} onBack={handleBack} />
        </Match>
      </Switch>
    </main>
  );
};
