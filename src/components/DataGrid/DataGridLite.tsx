import { Accessor, For, createEffect, createSignal, Show } from "solid-js";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export type UpdateTableData = (
  rowIndex: number,
  columnId: string,
  value: unknown
) => void;

declare module "@tanstack/solid-table" {
  interface TableMeta<TData extends RowData> {
    updateData: UpdateTableData;
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
    console.log(incomingData);
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
    <div class="flex flex-col gap-2">
      <div class="w-1/5 sticky top-0">
        <Input
          type="text"
          value={globalFilter() ?? ""}
          onInput={(e) => debounceSetGlobalFilter(e.currentTarget.value)}
          placeholder="Search all columns"
        />
      </div>
      {/* <div class="overflow-y-auto max-h-screen"> */}
      {/* <table class="table-auto border-collapse border-gray-300 bg-white w-full"> */}
      <Table>
        {/* <thead class="bg-gray-100"> */}
        <TableHeader>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              // <tr>
              <TableRow>
                <For each={headerGroup.headers}>
                  {(header) => (
                    // <th
                    //   class="w-auto py-2 px-4 text-gray-600 font-semibold sticky top-0 bg-gray-1"
                    //   style={{
                    //     "min-width": `${header.column.getSize()}px`,
                    //   }}
                    // >
                    <TableHead>
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
                      {/* </th> */}
                    </TableHead>
                  )}
                </For>
                {/* </tr> */}
              </TableRow>
            )}
          </For>
          {/* </thead> */}
        </TableHeader>
        {/* <tbody class="text-gray-500 text-sm"> */}
        <TableBody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              // <tr class="snap-start border-b border-t-0 border-l-0 border-r-0 border-solid">
              <TableRow>
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    // <td
                    //   class="py-2 px-4 w-auto"
                    //   style={{
                    //     "min-width": `${cell.column.getSize()}px`,
                    //   }}
                    // >
                    <TableCell>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {/* </td> */}
                    </TableCell>
                  )}
                </For>
                {/* </tr> */}
              </TableRow>
            )}
          </For>
          {/* </tbody> */}
        </TableBody>
        {/* </table> */}
      </Table>
      {/* </div> */}
    </div>
  );
};
