import {
  Accessor,
  For,
  createEffect,
  createSignal,
  Show,
  Switch,
  Match,
} from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import {
  RowData,
  SortingState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { FinancialTransactionView } from "../../lib/storage";
import { ParsedResult } from "../../types";
import {
  commonColumns,
  dataEntryPageColumns,
  transactionsPageColumns,
} from "./Column";
import { useLocation } from "@solidjs/router";
import { Input } from "../Input";
import { ColumnSort } from "./ColumnSort";
import { ColumnResizer } from "./ColumnResizer";

declare module "@tanstack/solid-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

interface DataGridLiteProps {
  rowData: Accessor<ParsedResult<FinancialTransactionView> | undefined>;
}

export const DataGridLite = (props: DataGridLiteProps) => {
  const [data, setData] = createSignal<Partial<FinancialTransactionView>[]>([]);
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [globalFilter, setGlobalFilter] = createSignal("");
  const location = useLocation();

  const setColumns = () => {
    if (location.pathname.includes("dataEntry")) {
      return dataEntryPageColumns;
    } else if (location.pathname.includes("transactions")) {
      return transactionsPageColumns;
    }
    return commonColumns;
  };

  const debounceSetGlobalFilter = debounce(
    (value: string) => setGlobalFilter(value),
    500
  );

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
    columns: setColumns(),
    state: {
      get sorting() {
        return sorting();
      },
      get globalFilter() {
        return globalFilter();
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const currData = data();
        currData[rowIndex] = { ...currData[rowIndex], [columnId]: value };
        setData(currData);
      },
    },
  });

  return (
    <div class="flex flex-col gap-6">
      <div class="w-1/5">
        <Input
          type="text"
          value={globalFilter() ?? ""}
          onInput={(e) => debounceSetGlobalFilter(e.currentTarget.value)}
          placeholder="Search all columns"
        />
      </div>
      <div class="overflow-y-auto max-h-screen">
        <table class="table-auto border-collapse border-gray-300 bg-white w-full">
          <thead class="bg-gray-100">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        class="w-auto py-2 px-4 text-gray-600 font-semibold sticky top-0 bg-gray-1"
                        style={{
                          "min-width": `${header.column.getSize()}px`,
                        }}
                      >
                        <Show when={!header.isPlaceholder}>
                          <div class="flex flex-row items-center gap-6 w-full justify-between">
                            <div class="flex flex-row items-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <ColumnSort
                                  onSort={header.column.getToggleSortingHandler}
                                  sortDirection={header.column.getIsSorted()}
                                />
                              )}
                            </div>
                            <ColumnResizer
                              mode={table.options.columnResizeMode}
                              isResizing={header.column.getIsResizing()}
                              direction={table.options.columnResizeDirection}
                              deltaOffset={
                                table.getState().columnSizingInfo.deltaOffset
                              }
                              onResetSize={() => header.column.resetSize()}
                              onResize={header.getResizeHandler}
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
                <tr class="snap-start" border="b t-0 l-0 r-0 solid">
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td
                        class="py-2 px-4 w-auto"
                        style={{
                          "min-width": `${cell.column.getSize()}px`,
                        }}
                      >
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
    </div>
  );
};
