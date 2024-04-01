import { JSX, createResource, For } from "solid-js";
import { createStore } from "solid-js/store";
import { initDB } from "../../lib/storage/test";

export const AppDataEntry = () => {
  // const { entitySeeder, evolu, getAllEntities } = initDB();
  // entitySeeder();
  // const fetchEntities = async () => {
  //   return await evolu.loadQuery(getAllEntities);
  // };
  // const [entities] = createResource(fetchEntities);
  const [accountDetails, setAccountDetails] = createStore({
    name: "",
    type: "",
  });

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, Event> = (e) => {
    e.preventDefault();
    console.log("submittt");
  };
  return (
    <div class="flex flex-col w-full h-full">
      <div>
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
            <input
              type="text"
              name="entityName"
              placeholder="Financial Entity/Company"
            />
            <input type="number" placeholder="0.0" step="0.01" />
            <button type="submit">Create Account</button>
          </div>
        </form>
      </div>
      <div>Accounts</div>
    </div>
  );
};
