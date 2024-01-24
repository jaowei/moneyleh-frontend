import AgGridSolid from "ag-grid-solid";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./dataGrid.css";
import { Accessor } from "solid-js";

export interface RowData {
  date: string;
  description: string;
  amount: number;
}

interface DataGridProps {
  rowData: Accessor<Array<RowData> | undefined>;
}

export const DataGrid = ({ rowData }: DataGridProps) => {
  const columnDefs = [
    { field: "Date" },
    { field: "Description" },
    { field: "Amount" },
  ];

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  return (
    <div class="ag-theme-quartz w-3xl h-xl" p="l-24 r-4 b-6">
      <AgGridSolid
        rowData={rowData()}
        columnDefs={columnDefs}
        autoSizeStrategy={autoSizeStrategy}
        rowSelection={"multiple"}
      />
    </div>
  );
};
