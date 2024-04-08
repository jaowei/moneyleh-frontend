import { For, JSX, Show, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import initDb from "../../lib/storage/sqljs";
import { selectAllFinancialEntitiesSql } from "../../lib/storage/sql/FinancialEntity";

export const AppDataEntry = () => {
  const { database } = initDb;
  const [accountDetails, setAccountDetails] = createStore({
    name: "",
    type: "",
  });
  const [entities, setEntities] = createSignal<Array<any>>();

  createEffect(() => {
    const db = database();
    if (db) {
      setEntities(db.exec(selectAllFinancialEntitiesSql)[0].values);
    }
  });

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, Event> = (e) => {
    e.preventDefault();
    console.log("submittt");
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
              onInput={(e) => setAccountDetails("name", e.target.value)}
            />
            <select onChange={(e) => setAccountDetails("type", e.target.value)}>
              <option value="cash">Cash</option>
              <option value="investment">Investment</option>
              <option value="creditCard">Credit Card</option>
            </select>
            <select>
              <For each={entities()}>
                {(val) => {
                  const name = typeof val[1] === "string" ? val[1] : "N/A";
                  return (
                    <option value={name.toLowerCase().replaceAll(" ", "")}>
                      {name}
                    </option>
                  );
                }}
              </For>
            </select>
            <input type="number" placeholder="0.0" step="0.01" />
            <button type="submit">Create Account</button>
          </div>
        </form>
      </Show>
      <div>Accounts</div>
    </div>
  );
};
