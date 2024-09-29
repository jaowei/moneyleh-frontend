import { createEffect, createSignal, For, Index } from "solid-js";
import { TraversableProps, TraverseButtons } from "./TraverseButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ColumnMapInfo } from "./Migrations";

interface MappingProps extends TraversableProps {
  colNames: string[];
  selectedColMap: ColumnMapInfo[];
  onColMapSelection: (baseIdx: number, selectedIdxs: number[]) => void;
}

interface ColumnSelectorProps {
  idx: number;
  colNames: string[];
  baseColInfo: ColumnMapInfo;
  onColMapSelection: (values: string[], selectedIdxs: number) => void;
}

const ColumnSelector = (props: ColumnSelectorProps) => {
  const [values, setValues] = createSignal<string[]>([]);

  createEffect(() => {
    const existingValues = props.baseColInfo?.selectedColIdx?.map((idx) => {
      return props.colNames.at(idx) ?? "";
    });

    if (existingValues) {
      setValues(existingValues);
    }
  });

  const handleChange = (values: string[]) => {
    setValues(values);
    props.onColMapSelection(values, props.idx);
  };

  return (
    <div class="grid grid-cols-[1fr_2fr] grid-rows-2 gap-2">
      <div class="border rounded-xl p-2 font-semibold max-h-max bg-white text-center">
        {props.baseColInfo.baseColName}
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
        {props.baseColInfo.helperText}
      </div>
    </div>
  );
};

export const Mapping = (props: MappingProps) => {
  const handleColumnSelect = (values: string[], idx: number) => {
    const selectedIdxs = values.map((val: any) => {
      return props.colNames.findIndex((name: any) => name === val);
    });
    props.onColMapSelection(idx, selectedIdxs);
  };
  return (
    <div class="grid grid-cols-1 grid-rows-[1fr_max-content] gap-4 p-6 h-screen">
      <div class="flex flex-col gap-4 p-4 border rounded-xl bg-gray-100">
        <Index each={props.selectedColMap}>
          {(baseColInfo, idx) => (
            <ColumnSelector
              baseColInfo={baseColInfo()}
              idx={idx}
              colNames={props.colNames}
              onColMapSelection={handleColumnSelect}
            />
          )}
        </Index>
      </div>
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
