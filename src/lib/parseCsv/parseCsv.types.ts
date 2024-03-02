import { RowData } from "../../types";

export type CSVParser = (
  parsedContent: Papa.ParseResult<any>
) => Array<RowData>;
