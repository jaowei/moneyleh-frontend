import AgGridSolid from "ag-grid-solid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./dataGrid.css";
import { Accessor } from "solid-js";
import { RowData } from "../types";

interface DataGridProps {
  ref: any;
  rowData: Accessor<Array<RowData> | undefined>;
}

export const DataGrid = (props: DataGridProps) => {
  const columnDefs = [
    { field: "date", editable: true },
    { field: "currency", editable: true },
    { field: "description", editable: true },
    { field: "amount", editable: true },
  ];

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  return (
    <div class="ag-theme-quartz h-5/6">
      <AgGridSolid
        ref={props.ref}
        rowData={props.rowData()}
        columnDefs={columnDefs}
        autoSizeStrategy={autoSizeStrategy}
        rowSelection={"multiple"}
        enableCellTextSelection={true}
      />
    </div>
  );
};
