import { createEffect, createSignal } from "solid-js";
import initDB from "../../../lib/storage/sqljs";
import {
  FinancialTransaction,
  FinancialTransactionView,
} from "../../../lib/storage";
import { DataGridLite } from "../../../components";
import { ParsedResult } from "../../../types";
import { EMPTY_PARSED_RESULT } from "../../../constants";

export const Transactions = () => {
  const { database } = initDB;
  const [parsedResult, setParsedResult] =
    createSignal<ParsedResult<FinancialTransactionView>>(EMPTY_PARSED_RESULT);

  createEffect(() => {
    const db = database();
    if (db) {
      const res = FinancialTransaction?.selectAll?.(db);
      console.log(res);
      setParsedResult({
        data: res ?? [],
        format: "",
      });
    }
  });
  return (
    <div class="flex flex-col items-center justify-center p-6">
      <div class="flex text-gray-9 font-bold gap-2 p-4">
        Number of transactions:
        <div class="text-cyan-8">{parsedResult().data.length}</div>
      </div>
      <div>
        <DataGridLite rowData={parsedResult} />
      </div>
    </div>
  );
};
