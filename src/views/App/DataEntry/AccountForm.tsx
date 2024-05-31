import { For, JSX } from "solid-js";
import {
  FormField,
  Input,
  PrimaryButton,
  Select,
  checkValid,
} from "../../../components";
import { SetStoreFunction, createStore } from "solid-js/store";
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
  const [errors, setErrors] = createStore<Record<string, any>>({});

  const accountNameAlreadyExists = ({ value }: { value: any }) => {
    const exists = staticInfo.accounts.find((account) => {
      return account[2] === value;
    });
    return exists && `Name: "${value}" is already being used`;
  };

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    if (errors.accountName) {
      return;
    }
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
        console.log(error);
        toast.error("Error inserting into DB", { position: "top-center" });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        class="flex gap-6 items-end"
        border="none"
        disabled={!!props.formInfo.accountId}
      >
        <FormField
          formLabel="Account Name"
          formMessage={errors.accountName ?? ""}
        >
          <Input
            type="text"
            name="accountName"
            placeholder="Account Name"
            onBlur={(e) => {
              checkValid(e, [accountNameAlreadyExists], setErrors);
            }}
            onInput={(e) => props.setFormInfo("name", e.target.value)}
            required
          />
        </FormField>
        <FormField formLabel="Account Type">
          <Select onChange={(e) => props.setFormInfo("type", e.target.value)}>
            <option value={AccountTypes.CASH}>Cash</option>
            <option value={AccountTypes.INVESTMENT}>Investment</option>
            <option value={AccountTypes.CREDITCARD}>Credit Card</option>
          </Select>
        </FormField>
        <FormField formLabel="Financial Entity (Company)">
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
        </FormField>
        <FormField formLabel="Initial Account Balance">
          <Input
            type="number"
            value="0.0"
            step="0.01"
            onChange={(e) =>
              props.setFormInfo("startingBalance", parseFloat(e.target.value))
            }
          />
        </FormField>
        <FormField>
          <PrimaryButton
            type="submit"
            disabled={
              !props.formInfo.name ||
              !!props.formInfo.accountId ||
              !!errors.accountName
            }
          >
            Create Account
          </PrimaryButton>
        </FormField>
      </fieldset>
    </form>
  );
};
