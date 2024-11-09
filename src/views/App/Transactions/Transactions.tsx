import { createEffect, createSignal, For, Show } from "solid-js";
import initDB from "../../../lib/storage/sqljs";
import {
  FinancialTransaction,
  FinancialTransactionView,
} from "../../../lib/storage";
import { ParsedResult } from "../../../types";
import { EMPTY_PARSED_RESULT } from "../../../constants";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import { transactionsPageColumns } from "~/components/DataGrid/Column";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const Transactions = () => {
  const { database } = initDB;
  const [parsedResult, setParsedResult] =
    createSignal<ParsedResult<FinancialTransactionView>>(EMPTY_PARSED_RESULT);
  const [paginationState, setPaginationState] = createSignal({
    pageIndex: 1,
    pageSize: 20,
  });

  createEffect(() => {
    const db = database();
    if (db) {
      const res = FinancialTransaction?.selectAll?.(db);
      setParsedResult({
        data: res ?? [],
        format: "",
      });
    }
  });

  const table = createSolidTable({
    get data() {
      return parsedResult().data;
    },
    columns: transactionsPageColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPaginationState,
    state: {
      get pagination() {
        return paginationState();
      },
    },
  });

  return (
    <div class="flex flex-col items-center justify-center p-6 h-screen">
      <div class="flex text-gray-9 font-bold gap-2 p-2">
        Number of transactions:
        <div class="text-cyan-8">{parsedResult().data.length}</div>
      </div>
      <div class="flex flex-col gap-2 h-full w-full overflow-auto">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <TableHead
                        style={{
                          "min-width": `${header.column.getSize()}px`,
                        }}
                      >
                        <Show when={!header.isPlaceholder}>
                          <div class="flex flex-row items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        </Show>
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <For each={table.getRowModel().rows}>
              {(row) => (
                <TableRow>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <TableCell
                        style={{
                          "min-width": `${cell.column.getSize()}px`,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
        <div class="flex flex-row gap-4 items-center">
          <Button size="sm" variant="outline" onClick={() => table.firstPage()}>
            {"<<"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
          >
            {"<"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => table.nextPage()}>
            {">"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => table.lastPage()}>
            {">>"}
          </Button>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(e ?? 20);
            }}
            options={[20, 50, 100]}
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger>
              <SelectValue<number>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
      </div>
    </div>
  );
};
