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
    { field: "Date" },
    { field: "Description" },
    { field: "Amount" },
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
          <button onClick={onClickCopyAll} disabled={!props.rowData()?.length}>
            <div class="flex flex-row">
              <div class="i-radix-icons-clipboard" />
              Copy All
            </div>
          </button>
          <button onClick={onClickDownload} disabled={!props.rowData()?.length}>
            <div class="flex flex-row">
              <div class="i-radix-icons-download" />
              Download as CSV
            </div>
          </button>
        </div>
      </div>
      <div class="ag-theme-quartz w-7xl h-xl">
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
