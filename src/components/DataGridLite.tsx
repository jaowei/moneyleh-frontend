import {
  Accessor,
  For,
  createEffect,
  createSignal,
  Show,
  Switch,
  Match,
} from "solid-js";
import {
  CellContext,
  RowData,
  SortingState,
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { FinancialTransactionView } from "../lib/storage";
import { ParsedResult } from "../types";

declare module "@tanstack/solid-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

interface DataGridLiteProps {
  rowData: Accessor<ParsedResult<FinancialTransactionView> | undefined>;
}

const columnHelper = createColumnHelper<Partial<FinancialTransactionView>>();

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
  "bg-transparent text-gray-500 border border-transparent py-2.5 focus:outline-0 focus:bg-white focus:rounded-lg";

const editableStringInputCell = (
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

const editableNumberInputCell = (
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

const defaultColumns = [
  columnHelper.accessor("transactionDate", {
    header: "Transaction Date",
    cell: editableStringInputCell,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: editableStringInputCell,
    size: 256,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: editableNumberInputCell,
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
    cell: editableStringInputCell,
  }),
  columnHelper.accessor("transactionMethod", {
    header: "Transaction Method",
    cell: editableStringInputCell,
  }),
  columnHelper.accessor("transactionType", {
    header: "Transaction Type",
    cell: editableStringInputCell,
  }),
  columnHelper.accessor("transactionSubType", {
    header: "Transaction Sub Type",
    cell: editableStringInputCell,
  }),
];

export const DataGridLite = (props: DataGridLiteProps) => {
  const [data, setData] = createSignal<Partial<FinancialTransactionView>[]>([]);
  const [sorting, setSorting] = createSignal<SortingState>([]);

  createEffect(() => {
    const incomingData = props?.rowData()?.data;
    if (incomingData) {
      setData(incomingData);
    }
  });

  const table = createSolidTable({
    get data() {
      return data();
    },
    columns: defaultColumns,
    state: {
      get sorting() {
        return sorting();
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log(rowIndex, columnId, value);
        const currData = data();
        currData[rowIndex] = { ...currData[rowIndex], [columnId]: value };
        setData(currData);
      },
    },
    defaultColumn: {
      size: 128,
      minSize: 96,
      maxSize: 384,
    },
  });

  return (
    <div>
      <table class="table-auto border-collapse border-gray-300 rounded-md">
        <thead class="bg-gray-100">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th
                      class={`py-2 px-4 text-gray-600 font-semibold`}
                      style={{
                        width: `${header.column.getSize()}px`,
                      }}
                    >
                      <Show when={!header.isPlaceholder}>
                        <div
                          class="flex flex-row items-center gap-6 w-full justify-between"
                          cursor={
                            header.column.getCanSort() ? "pointer" : undefined
                          }
                        >
                          <div
                            class="flex flex-row items-center gap-2"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <Switch
                              fallback={
                                <div class="i-radix-icons:caret-sort w-1em h-1em" />
                              }
                            >
                              <Match
                                when={header.column.getIsSorted() === "asc"}
                              >
                                <div class="i-radix-icons:caret-up w-1em h-1em" />
                              </Match>
                              <Match
                                when={header.column.getIsSorted() === "desc"}
                              >
                                <div class="i-radix-icons:caret-down w-1em h-1em" />
                              </Match>
                            </Switch>
                          </div>
                          <div
                            class="w-2 h-6 bg-red"
                            style={{
                              transform:
                                table.options.columnResizeMode === "onEnd" &&
                                header.column.getIsResizing()
                                  ? `translateX(${
                                      (table.options.columnResizeDirection ===
                                      "rtl"
                                        ? -1
                                        : 1) *
                                      (table.getState().columnSizingInfo
                                        .deltaOffset ?? 0)
                                    }px)`
                                  : "",
                            }}
                            onDblClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                          />
                        </div>
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody class="text-gray-500 text-sm">
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr border="b t-0 l-0 r-0 solid">
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td class="py-2 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};
