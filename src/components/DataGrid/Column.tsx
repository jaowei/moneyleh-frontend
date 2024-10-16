import { createColumnHelper } from "@tanstack/solid-table";
import {
  editableStringInputCell,
  editableNumberInputCell,
  selectTransactionMethodCell,
  selectTransactionTypeCell,
  genericCell,
} from "./Cells";

const columnHelper = createColumnHelper<any>();

export const columnHelpers = {
  transactionDate: columnHelper.accessor("transactionDate", {
    header: "Transaction Date",
    cell: editableStringInputCell,
  }),
  description: columnHelper.accessor("description", {
    header: "Description",
    cell: editableStringInputCell,
    size: 300,
  }),
  amount: columnHelper.accessor("amount", {
    header: "Amount",
    cell: editableNumberInputCell,
    size: 90,
  }),
  currency: columnHelper.accessor("currency", {
    header: "Currency",
    cell: editableStringInputCell,
    size: 90,
  }),
  account: columnHelper.accessor("account", {
    header: "Account Name",
    cell: genericCell,
  }),
  transactionTags: columnHelper.accessor("transactionTags", {
    header: "Transaction Tags",
    cell: genericCell,
  }),
  entity: columnHelper.accessor("entity", {
    header: "Entity",
    cell: genericCell,
  }),
};

export const commonColumns = [
  columnHelpers.transactionDate,
  columnHelpers.description,
  columnHelpers.amount,
  columnHelpers.currency,
  columnHelper.accessor("transactionMethod", {
    header: "Transaction Method",
    cell: selectTransactionMethodCell,
    size: 200,
  }),
  columnHelper.accessor("transactionType", {
    header: "Transaction Type",
    cell: selectTransactionTypeCell,
    size: 200,
  }),
];

export const dataEntryPageColumns = [...commonColumns];

export const transactionsPageColumns = [
  columnHelper.accessor("account", {
    header: "Account Name",
    cell: genericCell,
  }),
  columnHelpers.transactionDate,
  columnHelpers.description,
  columnHelpers.amount,
  columnHelpers.currency,
  columnHelper.accessor("transactionMethod", {
    header: "Transaction Method",
    cell: genericCell,
  }),
  columnHelper.accessor("transactionType", {
    header: "Transaction Type",
    cell: genericCell,
  }),
];
