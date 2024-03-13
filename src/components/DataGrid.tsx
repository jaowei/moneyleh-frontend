import AgGridSolid from "ag-grid-solid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./dataGrid.css";
import { Accessor, Setter } from "solid-js";
import { ParsedResult } from "../types";

interface DataGridProps {
  gridRef: Accessor<any>;
  gridRefSetter: Setter<any>;
  parsedResult: Accessor<ParsedResult | undefined>;
}

export const DataGrid = (props: DataGridProps) => {
  const columnDefs = [
    { field: "date", editable: true },
    { field: "description", editable: true },
    { field: "amount", editable: true },
    { field: "account", editable: true, filter: "agTextColumnFilter" },
    { field: "currency", editable: true },
    { field: "parentTag", editable: true },
    { field: "childTag", editable: true },
    { field: "transactionCode", editable: true },
  ];

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  return (
    <div class="ag-theme-quartz h-5/6">
      <AgGridSolid
        ref={props.gridRefSetter}
        rowData={props.parsedResult()?.data}
        columnDefs={columnDefs}
        autoSizeStrategy={autoSizeStrategy}
        rowSelection={"multiple"}
        enableCellTextSelection={true}
      />
    </div>
  );
};
