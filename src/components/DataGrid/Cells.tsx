import { CellContext } from "@tanstack/solid-table";
import { For, createEffect, createSignal } from "solid-js";
import { SqlValue } from "sql.js";
import { FinancialTransactionView } from "../../lib/storage";
import { Select } from "../Select";
import initDB from "../../lib/storage/sqljs";

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
  "bg-transparent text-gray-500 border border-transparent py-2.5 focus:outline-0 focus:bg-gray-1 focus:rounded-lg";

export const editableStringInputCell = (
  props: CellContext<Partial<FinancialTransactionView>, string | undefined>
) => {
  const { value, setValue, onBlur } = editableState<string>(props);
  return (
    <div
      style={{
        width: `${props.column.getSize()}px`,
      }}
    >
      <input
        class={editableInputStyles}
        style={{
          width: `${props.column.getSize()}px`,
        }}
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
        style={{
          width: `${props.column.getSize()}px`,
        }}
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

const renderCellSelect = (options: SqlValue[][], currentValue: string) => {
  return (
    <Select>
      <option>Choose an option</option>
      <For each={options}>{(option) => renderOption(option, currentValue)}</For>
    </Select>
  );
};

export const selectTransactionMethodCell = (
  props: CellContext<Partial<FinancialTransactionView>, any | undefined>
) => {
  const { staticInfo } = initDB;

  return (
    <div>
      {renderCellSelect(staticInfo.transactionMethods, props.getValue())}
    </div>
  );
};

export const selectTransactionTypeCell = (
  props: CellContext<Partial<FinancialTransactionView>, any | undefined>
) => {
  const { staticInfo } = initDB;

  return (
    <div>{renderCellSelect(staticInfo.transactionTypes, props.getValue())}</div>
  );
};

export const selectTransactionSubTypeCell = (
  props: CellContext<Partial<FinancialTransactionView>, any | undefined>
) => {
  const { staticInfo } = initDB;

  return (
    <div>
      {renderCellSelect(staticInfo.transactionSubTypes, props.getValue())}
    </div>
  );
};
