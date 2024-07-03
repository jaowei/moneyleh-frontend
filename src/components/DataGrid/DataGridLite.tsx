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
    defaultColumn: {
      size: 128,
      minSize: 96,
      maxSize: 384,
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
      <div class="sm:max-w-sm md:max-w-lg lg:max-w-3xl xl:max-w-5xl 2xl:max-w-7xl max-h-lg overflow-y-auto">
        <table class="table-auto border-collapse border-gray-300 bg-white">
          <thead class="bg-gray-100">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        class="py-2 px-4 text-gray-600 font-semibold sticky top-0 bg-gray-1"
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
                              class="w-1 h-6 bg-gray-200"
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
                <tr class="snap-start" border="b t-0 l-0 r-0 solid">
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
    </div>
  );
};
