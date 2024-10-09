import { createSignal, JSX, Match, Switch } from "solid-js";
import { ExcelFileParser } from "~/lib/parsers";
import { FileInput } from "./FileInput";
import { SheetSelection } from "./SheetSelection";
import { WorkBook } from "xlsx";
import { Mapping } from "./Mapping";
import { Preview } from "./Preview";
import { Save } from "./Save";
import { createStore } from "solid-js/store";

export interface ColumnMapInfo {
  baseColName: string;
  helperText: string;
  selectedColIdx?: number[];
}

export interface ColumnMap {
  transactionDate: ColumnMapInfo;
  description: ColumnMapInfo;
  amount: ColumnMapInfo;
  currency: ColumnMapInfo;
  account: ColumnMapInfo;
  entity: ColumnMapInfo;
  tag: ColumnMapInfo;
}

const increment = (prev: number) => prev + 1;
const decrement = (prev: number) => prev - 1;

export type ColumnMapKeys = keyof ColumnMap;

const selectedColMap: ColumnMap = {
  transactionDate: {
    baseColName: "Transaction Date",
    helperText: "Date of the transaction",
  },
  description: {
    baseColName: "Description",
    helperText: "Description of the transaction, can be multiple columns",
  },
  amount: {
    baseColName: "Amount",
    helperText: "Amount can be positive or negative value of the transaction",
  },
  currency: {
    baseColName: "Currency",
    helperText: "Currency transaction was made in",
  },
  account: {
    baseColName: "Account",
    helperText: "The account the transaction was made under",
  },
  entity: {
    baseColName: "Entity",
    helperText: "The company that the account is under",
  },
  tag: {
    baseColName: "Transaction Tag",
    helperText:
      "Any useful information that can be used to categorise the transaction",
  },
};

export const Migrations = () => {
  const [sequenceIdx, setSequenceIdx] = createSignal(0);
  const [sheetNames, setSheetNames] = createSignal<string[]>([]);
  const [sheets, setSheets] = createSignal<WorkBook["Sheets"]>({});
  const [selectedCols, setSelectedCols] = createSignal<string[]>([]);
  const [colMap, setColMap] = createStore(selectedColMap);
  const [selectedSheetData, setSelectedSheetData] = createSignal<any[][]>([]);

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

  const handleSheetSelection = (cols: string[], selectedSheetData: any[][]) => {
    setSelectedCols(cols);
    setSelectedSheetData(selectedSheetData);
  };

  const handleColMapSelection = (
    key: ColumnMapKeys,
    selectedIdxs: number[]
  ) => {
    setColMap(key, (prev) => ({
      ...prev,
      selectedColIdx: selectedIdxs,
    }));
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
            selectedColMap={colMap}
            onColMapSelection={handleColMapSelection}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        </Match>
        <Match when={sequenceIdx() === 3}>
          <Preview
            colMap={colMap}
            sheetData={selectedSheetData()}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        </Match>
        <Match when={sequenceIdx() === 4}>
          <Save onContinue={handleContinue} onBack={handleBack} />
        </Match>
      </Switch>
    </main>
  );
};
