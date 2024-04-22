import { Accessor, For, createEffect, createSignal } from "solid-js";
import {
  RowData,
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { FinancialTransactionModel } from "../lib/storage";
import { ParsedResult } from "../types";

declare module "@tanstack/solid-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

interface DataGridLiteProps {
  rowData: Accessor<ParsedResult<FinancialTransactionModel> | undefined>;
}

const columnHelper = createColumnHelper<Partial<FinancialTransactionModel>>();

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
          value={value() as string}
          onBlur={onBlur}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    },
  }),
  columnHelper.accessor("description", { header: "Description" }),
  columnHelper.accessor("amount", { header: "Amount" }),
  columnHelper.accessor("currency", { header: "Currency" }),
  columnHelper.accessor("transactionMethodId", {
    header: "Transaction Method",
  }),
  columnHelper.accessor("transactionTypeId", { header: "Transaction Type" }),
  columnHelper.accessor("transactionSubTypeId", {
    header: "Transaction Sub Type",
  }),
];

export const DataGridLite = (props: DataGridLiteProps) => {
  const [data, setData] = createSignal<Partial<FinancialTransactionModel>[]>(
    []
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
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),

    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log(rowIndex, columnId, value);
        const currData = data();

        setData(
          currData.map((row) => {
            return {
              ...row,
              [columnId]: value,
            };
          })
        );
      },
    },
  });

  return (
    <div>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="border border-slate-900">
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
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td>
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
