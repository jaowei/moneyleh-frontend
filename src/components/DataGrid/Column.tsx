import { createColumnHelper } from "@tanstack/solid-table";
import { FinancialTransactionView } from "../../lib/storage";
import {
  editableStringInputCell,
  editableNumberInputCell,
  selectTransactionMethodCell,
  selectTransactionTypeCell,
  selectTransactionSubTypeCell,
  genericCell,
} from "./Cells";

const columnHelper = createColumnHelper<Partial<FinancialTransactionView>>();

export const commonColumns = [
  columnHelper.accessor("transactionDate", {
    header: "Transaction Date",
    cell: editableStringInputCell,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: editableStringInputCell,
    size: 256,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: editableNumberInputCell,
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
    cell: editableStringInputCell,
  }),
  columnHelper.accessor("transactionMethod", {
    header: "Transaction Method",
    cell: selectTransactionMethodCell,
  }),
  columnHelper.accessor("transactionType", {
    header: "Transaction Type",
    cell: selectTransactionTypeCell,
  }),
  columnHelper.accessor("transactionSubType", {
    header: "Transaction Sub Type",
    cell: selectTransactionSubTypeCell,
  }),
];

export const dataEntryPageColumns = [...commonColumns];

export const transactionsPageColumns = [
  columnHelper.accessor("account", {
    header: "Account Name",
    cell: genericCell,
  }),
  columnHelper.accessor("transactionDate", {
    header: "Transaction Date",
    cell: genericCell,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: genericCell,
    size: 256,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: genericCell,
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
    cell: genericCell,
  }),
  columnHelper.accessor("transactionMethod", {
    header: "Transaction Method",
    cell: genericCell,
  }),
  columnHelper.accessor("transactionType", {
    header: "Transaction Type",
    cell: genericCell,
  }),
  columnHelper.accessor("transactionSubType", {
    header: "Transaction Sub Type",
    cell: genericCell,
  }),
];
