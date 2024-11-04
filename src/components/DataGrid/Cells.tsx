import { CellContext } from "@tanstack/solid-table";
import { createEffect, createMemo, createSignal, For } from "solid-js";
import { FinancialTransactionView } from "../../lib/storage";
import initDB from "../../lib/storage/sqljs";
import { UpdateTableData } from "./DataGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TextField, TextFieldInput } from "../ui/text-field";
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
} from "../ui/number-field";

export const genericCell = (
  info: CellContext<
    Partial<FinancialTransactionView>,
    string | number | undefined
  >
) => info.getValue;

function editableState<T>(
  props: CellContext<Partial<FinancialTransactionView>, T | undefined>
) {
  const [value, setValue] = createSignal<T>(props.getValue() as any);
  createEffect(() => {
    setValue(props.getValue());
  });
  const onBlur = () => {
    props.table.options.meta?.updateData(
      props.row.index,
      props.column.id,
      value()
    );
  };
  return { value, setValue, onBlur };
}

export const editableStringInputCell = (
  props: CellContext<Partial<FinancialTransactionView>, string | undefined>
) => {
  const { value, setValue, onBlur } = editableState<string>(props);
  return (
    <TextField value={value()} onBlur={onBlur} onChange={(e) => setValue(e)}>
      <TextFieldInput type="text" />
    </TextField>
  );
};

export const editableNumberInputCell = (
  props: CellContext<Partial<FinancialTransactionView>, number | undefined>
) => {
  const { value, setValue, onBlur } = editableState<number>(props);
  return (
    <NumberField
      value={value()}
      formatOptions={{
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }}
      onBlur={onBlur}
      onChange={(e) => setValue(parseInt(e, 10))}
    >
      <div class="relative">
        <NumberFieldInput />
        <NumberFieldIncrementTrigger />
        <NumberFieldDecrementTrigger />
      </div>
    </NumberField>
  );
};

interface CellSelectProps {
  options: Map<string, any>;
  currentValue: string;
  setValue: ((value: any) => void) | undefined;
}

interface CellMultiSelectProps extends Omit<CellSelectProps, "currentValue"> {
  currentValue: string[];
}

const CellSelect = (props: CellSelectProps) => {
  const options = createMemo(() => {
    const optsList = [];
    for (const opts of props.options) {
      optsList.push(opts[0]);
    }
    return optsList;
  });
  return (
    <Select
      class="w-full"
      value={props.currentValue}
      options={options()}
      placeholder="---"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger>
        <SelectValue<string>>
          {(state) => {
            props.setValue?.(state.selectedOption());
            return state.selectedOption();
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="max-h-96 overflow-auto" />
    </Select>
  );
};

const CellMultiSelect = (props: CellMultiSelectProps) => {
  const options = createMemo(() => {
    const optsList = [];
    for (const opts of props.options) {
      optsList.push(opts[0]);
    }
    return optsList;
  });
  return (
    <Select<string>
      class="w-full"
      multiple
      value={props.currentValue}
      options={options()}
      placeholder="---"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger class="h-full">
        <SelectValue<string>>
          {(state) => {
            props.setValue?.(state.selectedOption());
            return (
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
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="h-96 overflow-auto" />
    </Select>
  );
};

const generateValueUpdater = (
  fn: UpdateTableData | undefined,
  rowIdx: number,
  columnId: string
) => {
  if (!fn) {
    return;
  }
  return (value: any) => fn(rowIdx, columnId, value);
};

export const selectTransactionMethodCell = (
  props: CellContext<Partial<FinancialTransactionView>, any | undefined>
) => {
  const { staticInfo } = initDB;

  return (
    <CellSelect
      options={staticInfo.transactionMethods}
      currentValue={props.getValue()}
      setValue={generateValueUpdater(
        props.table.options.meta?.updateData,
        props.row.index,
        props.column.id
      )}
    />
  );
};

export const selectTransactionTypeCell = (
  props: CellContext<Partial<FinancialTransactionView>, any | undefined>
) => {
  const { staticInfo } = initDB;

  return (
    <CellSelect
      options={staticInfo.transactionTypes}
      currentValue={props.getValue()}
      setValue={generateValueUpdater(
        props.table.options.meta?.updateData,
        props.row.index,
        props.column.id
      )}
    />
  );
};

export const selectTransactionTagsCell = (
  props: CellContext<Partial<FinancialTransactionView>, any | undefined>
) => {
  const { staticInfo } = initDB;

  return (
    <CellMultiSelect
      options={staticInfo.transactionTags}
      currentValue={props.getValue()}
      setValue={generateValueUpdater(
        props.table.options.meta?.updateData,
        props.row.index,
        props.column.id
      )}
    />
  );
};
