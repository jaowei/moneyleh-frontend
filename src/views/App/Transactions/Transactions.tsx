import { createEffect, createSignal } from "solid-js";
import initDB from "../../../lib/storage/sqljs";
import { FinancialTransaction } from "../../../lib/storage";

export const Transactions = () => {
  const { database, staticInfo } = initDB;
  const [transactions, setTransactions] = createSignal<any>();
  createEffect(() => {
    const db = database();
    if (db) {
      const res = FinancialTransaction?.selectAll?.(db);
      console.log(res);
    }
  });
  return <div />;
};
