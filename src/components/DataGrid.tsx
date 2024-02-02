import AgGridSolid from "ag-grid-solid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./dataGrid.css";
import { Accessor, JSX } from "solid-js";
import toast from "solid-toast";

export interface RowData {
  date: string;
  description: string;
  amount: number;
}

interface DataGridProps {
  rowData: Accessor<Array<RowData> | undefined>;
}

export const DataGrid = (props: DataGridProps) => {
  let gridRef: any;

  const columnDefs = [
    { field: "Date", editable: true },
    { field: "Description", editable: true },
    { field: "Amount", editable: true },
  ];

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  const onClickCopyAll: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(gridRef.api.getDataAsCsv());
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy data");
    }
  };

  const onClickDownload: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (e) => {
    e.preventDefault();
    try {
      gridRef.api.exportDataAsCsv();
      toast.success("Downloaded!");
    } catch (error) {
      toast.error("Failed to download, please try again.");
    }
  };

  return (
    <div>
      <div class="flex justify-center" p="t-12">
        <div class="flex justify-between max-w-xs" p="b-4">
          <button
            onClick={onClickCopyAll}
            disabled={!props.rowData()?.length}
            bg={!props.rowData()?.length ? "gray-500" : "cyan-900"}
            cursor={!props.rowData()?.length ? "not-allowed" : "pointer"}
            text="white sm"
            border="~ solid black"
            p="y-1 x-2"
            class="rounded font-sans"
          >
            <div class="flex flex-row items-center">
              <div class="i-radix-icons-clipboard" />
              Copy All
            </div>
          </button>
          <button
            onClick={onClickDownload}
            disabled={!props.rowData()?.length}
            bg={!props.rowData()?.length ? "gray-500" : "cyan-900"}
            cursor={!props.rowData()?.length ? "not-allowed" : "pointer"}
            text="white sm"
            border="~ solid black"
            p="y-1 x-2"
            class="rounded font-sans"
          >
            <div class="flex flex-row items-center">
              <div class="i-radix-icons-download" />
              Download as CSV
            </div>
          </button>
        </div>
      </div>
      <div class="ag-theme-quartz w-7xl h-xl" p="b-12">
        <AgGridSolid
          ref={gridRef}
          rowData={props.rowData()}
          columnDefs={columnDefs}
          autoSizeStrategy={autoSizeStrategy}
          rowSelection={"multiple"}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};
