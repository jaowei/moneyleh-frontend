import { CellContext } from "@tanstack/solid-table";
import { For, createEffect, createSignal } from "solid-js";
import { SqlValue } from "sql.js";
import { FinancialTransactionView } from "../../lib/storage";
import initDB from "../../lib/storage/sqljs";
import { UpdateTableData } from "./DataGridLite";
import { Select } from "../ui/select";

export const genericCell = (
  info: CellContext<
    Partial<FinancialTransactionView>,
    string | number | undefined
  >
) => info.getValue;

function editableState<T>(
  props: CellContext<Partial<FinancialTransactionView>, T | undefined>
) {
  const [value, setValue] = createSignal<T>();
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

const editableInputStyles =
  "bg-transparent text-gray-500 border border-transparent py-2.5 focus:outline-0 focus:bg-gray-1 focus:rounded-lg w-full";

export const editableStringInputCell = (
  props: CellContext<Partial<FinancialTransactionView>, string | undefined>
) => {
  const { value, setValue, onBlur } = editableState<string>(props);
  return (
    <div>
      <input
        class={editableInputStyles}
        value={value()}
        onBlur={onBlur}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const editableNumberInputCell = (
  props: CellContext<Partial<FinancialTransactionView>, number | undefined>
) => {
  const { value, setValue, onBlur } = editableState<number>(props);
  return (
    <div>
      <input
        class={editableInputStyles}
        type="number"
        step="0.01"
        value={value()}
        onBlur={onBlur}
        onChange={(e) => setValue(parseInt(e.target.value))}
      />
    </div>
  );
};

const renderOption = (value: SqlValue[], currentValue: string) => {
  const methodName = typeof value[2] === "string" ? value[2] : "N/A";
  return (
    <option value={methodName} selected={currentValue === methodName}>
      {methodName}
    </option>
  );
};

const renderCellSelect = (
  options: SqlValue[][],
  currentValue: string,
  setValue: ((value: any) => void) | undefined
) => {
  return (
    <Select
      onChange={(e) => {
        setValue?.(e.target.selectedOptions[0].label);
      }}
    >
      <option>Choose an option</option>
      <For each={options}>{(option) => renderOption(option, currentValue)}</For>
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
    <div>
      {renderCellSelect(
        staticInfo.transactionMethods,
        props.getValue(),
        generateValueUpdater(
          props.table.options.meta?.updateData,
          props.row.index,
          props.column.id
        )
      )}
    </div>
  );
};

export const selectTransactionTypeCell = (
  props: CellContext<Partial<FinancialTransactionView>, any | undefined>
) => {
  const { staticInfo } = initDB;

  return (
    <div>
      {renderCellSelect(
        staticInfo.transactionTypes,
        props.getValue(),
        generateValueUpdater(
          props.table.options.meta?.updateData,
          props.row.index,
          props.column.id
        )
      )}
    </div>
  );
};
