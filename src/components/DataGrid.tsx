import AgGridSolid from "ag-grid-solid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./dataGrid.css";
import { Accessor, JSX } from "solid-js";
import toast from "solid-toast";
import { PrimaryButton } from ".";
import { RowData } from "../types";

interface DataGridProps {
  rowData: Accessor<Array<RowData> | undefined>;
}

export const DataGrid = (props: DataGridProps) => {
  let gridRef: any;

  const columnDefs = [
    { field: "date", editable: true },
    { field: "currency", editable: true },
    { field: "description", editable: true },
    { field: "amount", editable: true },
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
      await navigator.clipboard.writeText(
        gridRef.api.getDataAsCsv({ columnSeparator: "\t" })
      );
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
      <div p="t-12">
        <div class="flex justify-between max-w-max mx-auto" p="b-4">
          <PrimaryButton
            onClick={onClickCopyAll}
            disabled={!props.rowData()?.length}
          >
            <div class="flex flex-row items-center">
              <div class="i-radix-icons-clipboard" />
              Copy All
            </div>
          </PrimaryButton>
          <PrimaryButton
            onClick={onClickDownload}
            disabled={!props.rowData()?.length}
          >
            <div class="flex flex-row items-center">
              <div class="i-radix-icons-download" />
              Download as CSV
            </div>
          </PrimaryButton>
        </div>
      </div>
      <div class="ag-theme-quartz h-xl " p="b-12">
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
