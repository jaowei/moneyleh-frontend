import { createEffect, createSignal, For } from "solid-js";
import initDB from "../../../lib/storage/sqljs";
import { AccountTotal } from "../../../lib/storage";

export const Accounts = () => {
  const { database } = initDB;
  const [accountTotals, setAccountTotals] = createSignal<any>();

  createEffect(() => {
    const db = database();
    if (db) {
      const res = AccountTotal.getTotal(db);
      setAccountTotals(res);
      console.log(res);
    }
  });

  return (
    <div>
      Accounts
      <For each={accountTotals()}>
        {(accountTotal) => (
          <div>
            <div>
              {accountTotal.name}
              {Math.round(
                (accountTotal.startingBalance + accountTotal.runningTotal) * 100
              ) / 100}
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
