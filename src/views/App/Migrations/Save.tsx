import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ColumnMap, DataToSave } from "./Migrations";
import { TraversableProps, TraverseButtons } from "./TraverseButtons";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { createMemo, For } from "solid-js";
import { genericCell } from "~/components/DataGrid/Cells";

interface SaveProps extends TraversableProps {
  colMap: ColumnMap;
  dataToSave: DataToSave;
  sheetData: any[][];
}

const columnHelper = createColumnHelper<any>();

const columnDefs = [
  columnHelper.accessor("transactionDate", {
    header: "Transaction Date",
    cell: genericCell,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: genericCell,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: genericCell,
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
    cell: genericCell,
  }),
  columnHelper.accessor("account", {
    header: "Account Name",
    cell: genericCell,
  }),
  columnHelper.accessor("entity", {
    header: "Entity",
    cell: genericCell,
  }),
  columnHelper.accessor("transactionTags", {
    header: "Transaction Tags",
    cell: genericCell,
  }),
];

const CellError = "Err!";

export const Save = (props: SaveProps) => {
  const transactionData = createMemo(() => {
    return props.sheetData.slice(0, 100).map((data) => {
      const transactionDateColIdx =
        props.colMap.transactionDate.selectedColIdx?.[0];
      const descriptionColIdx = props.colMap.description.selectedColIdx;
      const amountColIdx = props.colMap.amount.selectedColIdx?.[0];
      const currencyColIdx = props.colMap.currency.selectedColIdx?.[0];
      const accountColIdx = props.colMap.account.selectedColIdx?.[0];
      const entityColIdx = props.colMap.entity.selectedColIdx?.[0];
      const tagColIdx = props.colMap.tag.selectedColIdx?.[0];
      const description = descriptionColIdx?.reduce((prev, curr) => {
        return prev + " " + (data[curr] ?? "");
      }, "");
      return {
        transactionDate:
          transactionDateColIdx !== undefined
            ? new Date(data[transactionDateColIdx]).toLocaleDateString()
            : CellError,
        description: descriptionColIdx ? description : CellError,
        amount: amountColIdx ? data[amountColIdx] : CellError,
        currency: currencyColIdx ? data[currencyColIdx] : CellError,
        account: accountColIdx ? data[accountColIdx] : CellError,
        entity: entityColIdx ? data[entityColIdx] : CellError,
        transactionTags: tagColIdx ? data[tagColIdx] : CellError,
      };
    });
  });

  const transactionsTable = createSolidTable({
    get data() {
      return transactionData();
    },
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div class="grid grid-cols-1 grid-rows-[1fr_max-content] h-screen gap-6 p-6">
      <div class="overflow-auto border rounded-xl">
        <Table>
          <TableHeader>
            <For each={transactionsTable.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <TableHead>
                        {flexRender(
                          header.column.columnDef.header ?? "",
                          header.getContext()
                        )}
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <For each={transactionsTable.getRowModel().rows}>
              {(row) => (
                <TableRow>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <TableCell>
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
      </div>
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
