import { createEffect, createSignal, For, Show } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { utils, WorkBook } from "xlsx";
import {
  AccessorKeyColumnDef,
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  Table,
} from "@tanstack/solid-table";
import {
  TableHeader,
  Table as TableComponent,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import toast from "solid-toast";
import { TraversableProps, TraverseButtons } from "./TraverseButtons";

interface SheetSelectionProps extends TraversableProps {
  sheetNames: string[];
  sheets: WorkBook["Sheets"];
  onSelection: (cols: string[], sheetData: any[][]) => void;
}

const colHelper = createColumnHelper<any>();

export const SheetSelection = (props: SheetSelectionProps) => {
  const [selectedSheet, setSelectedSheet] = createSignal<string>();
  const [previewData, setPreviewData] = createSignal<any[]>([]);
  const [columnsDefs, setColumnsDefs] = createSignal<
    AccessorKeyColumnDef<any, any>[]
  >([]);
  const [table, setTable] = createSignal<Table<any>>();

  const handleSelectChange = (selectedValue: string) => {
    try {
      setSelectedSheet(selectedValue);
      const sheetData = props.sheets[selectedValue];
      const arrData = utils.sheet_to_json<any[]>(sheetData, { header: 1 });
      if (!arrData.length) return;
      const cols = arrData[0];
      props.onSelection(cols, arrData.slice(1));
      const colDefs = cols.map((col) => {
        if (typeof col === "string") {
          return colHelper.accessor(col, {
            header: col,
          });
        }
        return colHelper.accessor("", { header: "" });
      });
      setColumnsDefs(colDefs);
      const cleanRows = arrData.slice(1, 100).map((val) => {
        return val.reduce(
          (prev, curr, idx) => ({ ...prev, [cols[idx]]: curr }),
          {}
        );
      });
      setPreviewData(cleanRows);
    } catch (error) {
      toast.error("Cannot preview this sheet, no headers detected!", {
        position: "top-center",
      });
      setPreviewData([]);
      setColumnsDefs([]);
      props.onSelection([], []);
    }
  };

  createEffect(() => {
    const table = createSolidTable({
      get data() {
        return previewData();
      },
      columns: columnsDefs(),
      getCoreRowModel: getCoreRowModel(),
    });
    setTable(table);
  });

  return (
    <div class="grid grid-cols-1 grid-rows-[max-content_1fr_max-content] gap-4 p-6 h-screen">
      <Select
        value={selectedSheet()}
        onChange={handleSelectChange}
        options={props.sheetNames}
        placeholder="Select a sheet to parse"
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <SelectTrigger>
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <Show
        when={previewData().length}
        fallback={
          <div class="flex items-center justify-center bg-gray-100 rounded-xl">
            Preview Data
          </div>
        }
      >
        <TableComponent>
          <TableHeader>
            <For each={table()?.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <TableHead class="bg-gray-100">
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
            <For each={table()?.getRowModel().rows}>
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
        </TableComponent>
      </Show>
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
