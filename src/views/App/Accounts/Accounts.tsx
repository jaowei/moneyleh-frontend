import { createEffect, createSignal, For, Show, Switch, Match } from "solid-js";
import initDB from "../../../lib/storage/sqljs";
import { AccountTotal } from "../../../lib/storage";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
} from "@tanstack/solid-table";
import { genericCell } from "../../../components/DataGrid/Cells";

declare module "@tanstack/solid-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const columnHelper = createColumnHelper<any>();

// const accountTotalCell = (props: CellContext<any, any>) => {};

export const accountTotalColumns = [
  columnHelper.accessor("name", {
    header: "Account Name",
    cell: genericCell,
  }),
  columnHelper.accessor("startingBalance", {
    header: "Starting Balance",
    cell: genericCell,
    size: 256,
  }),
  columnHelper.accessor("runningTotal", {
    header: "Current Balance",
    cell: genericCell,
  }),
  columnHelper.accessor("financialEntityId", {
    header: "Financial Entity",
    cell: genericCell,
  }),
  columnHelper.accessor("latestTransactionDate", {
    header: "Latest Transaction Date",
    cell: genericCell,
  }),
];

export const Accounts = () => {
  const { database } = initDB;
  const [accountTotals, setAccountTotals] = createSignal<any>([]);
  const [sorting, setSorting] = createSignal<SortingState>([]);

  createEffect(() => {
    const db = database();
    if (db) {
      const res = AccountTotal.getTotal(db);
      setAccountTotals(res);
      console.log(res);
    }
  });

  const table = createSolidTable({
    get data() {
      return accountTotals();
    },
    columns: accountTotalColumns,
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
        const currData = accountTotals();
        currData[rowIndex] = { ...currData[rowIndex], [columnId]: value };
        setAccountTotals(currData);
      },
    },
  });

  return (
    <div>
      Accounts
      <For each={table.getHeaderGroups()}>
        {(headerGroup) => (
          <div class="flex flex-row gap-4">
            <For each={headerGroup.headers}>
              {(header) => (
                <div>
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
                          <Match when={header.column.getIsSorted() === "asc"}>
                            <div class="i-radix-icons:caret-up w-1em h-1em" />
                          </Match>
                          <Match when={header.column.getIsSorted() === "desc"}>
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
                                  (table.options.columnResizeDirection === "rtl"
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
                </div>
              )}
            </For>
          </div>
        )}
      </For>
      <div>
        <For each={table.getRowModel().rows}>
          {(row) => (
            <div class="flex flex-row gap-4">
              <For each={row.getVisibleCells()}>
                {(cell) => (
                  <div>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {/* {accountTotal.name}
                  {Math.round(
                    (accountTotal.startingBalance + accountTotal.runningTotal) *
                      100
                  ) / 100} */}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
