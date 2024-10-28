import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  Show,
} from "solid-js";
import { TraversableProps, TraverseButtons } from "./Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ColumnMap, ColumnMapInfo, ColumnMapKeys } from "./Migrations";

interface MappingProps extends TraversableProps {
  colNames: string[];
  selectedColMap: ColumnMap;
  onColMapSelection: (key: ColumnMapKeys, selectedIdxs: number[]) => void;
}

interface ColumnSelectorProps {
  colNames: string[];
  baseColInfo: [ColumnMapKeys, ColumnMapInfo];
  onColMapSelection: (values: string[], key: ColumnMapKeys) => void;
}

const SingleColumnSelector = (props: ColumnSelectorProps) => {
  const [values, setValues] = createSignal<string | null>();

  createEffect(() => {
    const existingValues = props.baseColInfo[1]?.selectedColIdx?.map((idx) => {
      return props.colNames.at(idx) ?? "";
    });

    if (existingValues && existingValues.length) {
      setValues(existingValues[0]);
    }
  });

  const handleChange = (values?: string | null) => {
    setValues(values);
    props.onColMapSelection(values ? [values] : [], props.baseColInfo[0]);
  };

  return (
    <div class="grid grid-cols-[1fr_2fr] grid-rows-2 gap-2">
      <div class="border rounded-xl p-2 font-semibold max-h-max bg-white text-center">
        {props.baseColInfo[1].baseColName}
      </div>
      <div>
        <Select
          class="bg-white"
          value={values()}
          options={props.colNames}
          onChange={handleChange}
          placeholder="Select a column"
          itemComponent={(props) => (
            <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
          )}
        >
          <SelectTrigger class="h-full">
            <SelectValue<string>>
              {(state) => state.selectedOption()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </div>
      <div class="text-sm text-pretty text-gray-700 col-span-2 pxkk px-2">
        {props.baseColInfo[1].helperText}
      </div>
    </div>
  );
};

const MultipleColumnSelector = (props: ColumnSelectorProps) => {
  const [values, setValues] = createSignal<string[]>([]);

  createEffect(() => {
    const existingValues = props.baseColInfo[1]?.selectedColIdx?.map((idx) => {
      return props.colNames.at(idx) ?? "";
    });

    if (existingValues) {
      setValues(existingValues);
    }
  });

  const handleChange = (values: string[]) => {
    setValues(values);
    props.onColMapSelection(values, props.baseColInfo[0]);
  };

  return (
    <div class="grid grid-cols-[1fr_2fr] grid-rows-2 gap-2">
      <div class="border rounded-xl p-2 font-semibold max-h-max bg-white text-center">
        {props.baseColInfo[1].baseColName}
      </div>
      <div>
        <Select<string>
          class="bg-white"
          multiple
          value={values()}
          options={props.colNames}
          onChange={handleChange}
          placeholder="Select a column"
          itemComponent={(props) => (
            <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
          )}
        >
          <SelectTrigger class="h-full">
            <SelectValue<string>>
              {(state) => (
                <div class="flex flex-row gap-2 flex-wrap">
                  <For each={state.selectedOptions()}>
                    {(option) => (
                      <span
                        class="bg-gray-200 rounded-lg py-0.5 px-1"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {option}
                      </span>
                    )}
                  </For>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </div>
      <div class="text-sm text-pretty text-gray-700 col-span-2 pxkk px-2">
        {props.baseColInfo[1].helperText}
      </div>
    </div>
  );
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const checkIfAllMapped = (columnMap: ColumnMap) => {
  const allMaps = Object.values(columnMap);
  const allMapped = allMaps.reduce((prev, colMap) => {
    const hasSelections = (colMap?.selectedColIdx?.length ?? 0 > 0) ? 1 : 0;
    return prev + hasSelections;
  }, 0);
  return allMapped === allMaps.length;
};

export const Mapping = (props: MappingProps) => {
  const [allMapped, setAllMapped] = createSignal(false);

  const fixedCols = createMemo(() => {
    return Object.entries(props.selectedColMap) as Entries<ColumnMap>;
  });

  createEffect(() => {
    setAllMapped(checkIfAllMapped(props.selectedColMap));
  });

  const handleColumnSelect = (values: string[], key: ColumnMapKeys) => {
    const selectedIdxs = values.map((val: any) => {
      return props.colNames.findIndex((name: any) => name === val);
    });
    props.onColMapSelection(key, selectedIdxs);
    setAllMapped(checkIfAllMapped(props.selectedColMap));
  };

  return (
    <div class="grid grid-cols-1 grid-rows-[1fr_max-content] gap-4 p-6 h-screen">
      <div class="flex flex-col gap-4 p-4 border rounded-xl bg-gray-100">
        <Index each={fixedCols()}>
          {(baseColInfo) => {
            return (
              <Show
                when={baseColInfo()[1].isMulti}
                fallback={
                  <SingleColumnSelector
                    baseColInfo={baseColInfo()}
                    colNames={props.colNames}
                    onColMapSelection={handleColumnSelect}
                  />
                }
              >
                <MultipleColumnSelector
                  baseColInfo={baseColInfo()}
                  colNames={props.colNames}
                  onColMapSelection={handleColumnSelect}
                />
              </Show>
            );
          }}
        </Index>
      </div>
      <TraverseButtons
        onBack={props.onBack}
        onContinue={props.onContinue}
        isContinueDisabled={!allMapped()}
      />
    </div>
  );
};
