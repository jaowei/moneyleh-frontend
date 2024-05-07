import { Accessor, For, createEffect, createSignal } from "solid-js";
import {
  RowData,
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
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

const defaultColumns = [
  columnHelper.accessor("transactionDate", {
    header: "Transaction Date",
    cell: (props) => {
      const [value, setValue] = createSignal();
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
      return (
        <input
          class="w-full h-full bg-transparent text-gray-500 border border-transparent px-3 py-2.5"
          value={value() as string}
          onBlur={onBlur}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => <div class="">{info.getValue()}</div>,
  }),
  columnHelper.accessor("amount", { header: "Amount" }),
  columnHelper.accessor("currency", { header: "Currency" }),
  columnHelper.accessor("transactionMethod", {
    header: "Transaction Method",
  }),
  columnHelper.accessor("transactionType", { header: "Transaction Type" }),
  columnHelper.accessor("transactionSubType", {
    header: "Transaction Sub Type",
  }),
];

export const DataGridLite = (props: DataGridLiteProps) => {
  const [data, setData] = createSignal<Partial<FinancialTransactionView>[]>([]);

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
    getCoreRowModel: getCoreRowModel(),

    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log(rowIndex, columnId, value);
        const currData = data();
        currData[rowIndex] = { ...currData[rowIndex], [columnId]: value };
        setData(currData);
      },
    },
  });

  return (
    <div>
      <table class="border-collapse border-gray-300 rounded-md">
        <thead class="bg-gray-100">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="py-2 px-4 text-gray-600 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
