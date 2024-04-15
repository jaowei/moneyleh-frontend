import { For, JSX, Show, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SqlValue } from "sql.js";
import { Account, FinancialEntity } from "../../lib/storage";
import initDB from "../../lib/storage/sqljs";
import { DataGridLite } from "../../components";

const accountingRelationMap: Record<string, string> = {
  cash: "asset",
  investment: "asset",
  creditCard: "liability",
};

export const AppDataEntry = () => {
  const { database } = initDB;
  const [accountDetails, setAccountDetails] = createStore({
    $name: "",
    $type: "cash",
    $financialEntityId: 1,
    $startingBalance: 0,
  });
  const [entities, setEntities] = createSignal<SqlValue[][]>();

  createEffect(() => {
    const db = database();
    if (db) {
      const values = db.exec(FinancialEntity.queries.selectAll)[0]?.values;
      setEntities(values);
    }
  });

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, Event> = (e) => {
    e.preventDefault();
    const db = database();
    console.log("submittt", accountDetails);
    const accountData = {
      ...accountDetails,
      $accountingRelation: accountingRelationMap[accountDetails.$type],
    };
    if (db) {
      Account.insertOne?.(db, accountData);
    }
  };

  return (
    <div class="flex flex-col w-full h-full">
      <Show when={!database.loading} fallback={<div>Loading....</div>}>
        <form onSubmit={handleSubmit}>
          <div class="flex gap-6">
            <input
              type="text"
              name="accountName"
              placeholder="Account Name"
              onInput={(e) => setAccountDetails("$name", e.target.value)}
            />
            <select
              onChange={(e) => setAccountDetails("$type", e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="investment">Investment</option>
              <option value="creditCard">Credit Card</option>
            </select>
            <select
              onChange={(e) =>
                setAccountDetails(
                  "$financialEntityId",
                  e.target.selectedIndex + 1
                )
              }
            >
              <For each={entities()}>
                {(val) => {
                  const name = typeof val[2] === "string" ? val[2] : "N/A";
                  return (
                    <option value={name.toLowerCase().replaceAll(" ", "")}>
                      {name}
                    </option>
                  );
                }}
              </For>
            </select>
            <input
              type="number"
              value="0.0"
              step="0.01"
              onChange={(e) =>
                setAccountDetails(
                  "$startingBalance",
                  parseFloat(e.target.value)
                )
              }
            />
            <button type="submit">Create Account</button>
          </div>
        </form>
      </Show>
      <div>Accounts</div>
      <DataGridLite />
    </div>
  );
};
