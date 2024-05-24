import { For, JSX } from "solid-js";
import { Input, PrimaryButton, Select } from "../../../components";
import { SetStoreFunction } from "solid-js/store";
import { formInfo } from "./DataEntry";
import { AccountTypes } from "../../../constants";
import initDB from "../../../lib/storage/sqljs";
import { Account } from "../../../lib/storage";
import toast from "solid-toast";

interface AccountFormProps {
  formInfo: formInfo;
  setFormInfo: SetStoreFunction<formInfo>;
}

const accountingRelationMap: Record<string, string> = {
  cash: "asset",
  investment: "asset",
  creditCard: "liability",
};

export const AccountForm = (props: AccountFormProps) => {
  const { database, staticInfo } = initDB;

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    const db = database();
    const accountData = {
      $name: props.formInfo.name,
      $type: props.formInfo.type,
      $financialEntityId: props.formInfo.financialEntityId,
      $startingBalance: props.formInfo.startingBalance,
      $accountingRelation: accountingRelationMap[props.formInfo.type],
    };
    if (db) {
      try {
        const id = Account.insertOne?.(db, accountData);
        if (id) {
          props.setFormInfo("accountId", id[0]);
          toast.success(`Successfully created account with id ${id}`, {
            position: "top-center",
          });
        } else {
          throw new Error();
        }
      } catch (error) {
        toast.error("Error inserting into DB", { position: "top-center" });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div class="flex gap-6 h-10">
        <Input
          type="text"
          name="accountName"
          placeholder="Account Name"
          onInput={(e) => props.setFormInfo("name", e.target.value)}
        />
        <Select onChange={(e) => props.setFormInfo("type", e.target.value)}>
          <option value={AccountTypes.CASH}>Cash</option>
          <option value={AccountTypes.INVESTMENT}>Investment</option>
          <option value={AccountTypes.CREDITCARD}>Credit Card</option>
        </Select>
        <Select
          onChange={(e) =>
            props.setFormInfo(
              "financialEntityId",
              `${e.target.selectedIndex + 1}`
            )
          }
        >
          <For each={staticInfo.entities}>
            {(val) => {
              const name = typeof val[2] === "string" ? val[2] : "N/A";
              return (
                <option value={name.toLowerCase().replaceAll(" ", "")}>
                  {name}
                </option>
              );
            }}
          </For>
        </Select>
        <Input
          type="number"
          value="0.0"
          step="0.01"
          onChange={(e) =>
            props.setFormInfo("startingBalance", parseFloat(e.target.value))
          }
        />
        <PrimaryButton type="submit">Create Account</PrimaryButton>
      </div>
    </form>
  );
};
