import { JSX } from "solid-js";
import { FormField, Input, checkValid } from "../../../components";
import { SetStoreFunction, createStore } from "solid-js/store";
import { formInfo } from "./DataEntry";
import initDB from "../../../lib/storage/sqljs";
import { Account, DefaultAccountTypeIds } from "../../../lib/storage";
import toast from "solid-toast";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface AccountFormProps {
  formInfo: formInfo;
  setFormInfo: SetStoreFunction<formInfo>;
  closeForm?: () => void;
}

export const AccountForm = (props: AccountFormProps) => {
  const { database, staticInfo, refetch } = initDB;
  const [errors, setErrors] = createStore<Record<string, any>>({});

  const accountNameAlreadyExists = ({ value }: { value: any }) => {
    const exists = staticInfo.accounts.find((account) => {
      return account[2] === value;
    });
    return exists && `Name: "${value}" is already being used`;
  };

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();
    if (errors.accountName) {
      return;
    }
    const db = database();
    const accountData = {
      $name: props.formInfo.name,
      $financialEntityId: props.formInfo.financialEntityId,
      $startingBalance: props.formInfo.startingBalance,
      $accountTypeId: DefaultAccountTypeIds[props.formInfo.type],
    };
    if (db) {
      try {
        const id = await Account.insertOne?.(db, accountData);
        if (id) {
          props.setFormInfo("accountId", id[0]);
          toast.success(`Successfully created account with id ${id}`, {
            position: "top-center",
          });
          refetch();
          props?.closeForm?.();
        } else {
          toast.error("Error inserting into DB", { position: "top-center" });
        }
      } catch (error) {
        console.log(error);
        toast.error("Error inserting into DB", { position: "top-center" });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <fieldset class="ps-0 pe-0 p-0 m-0 ms-0 me-0 border-none">
        <div class="grid grid-cols-2 gap-4">
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
            <Select
              class="w-full"
              placeholder="Select account type"
              options={staticInfo.accountTypes.map((acctType) =>
                typeof acctType[2] === "string" ? acctType[2] : "N/A"
              )}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger>
                <SelectValue<string>>
                  {(state) => {
                    props.setFormInfo("type", state.selectedOption());
                    return state.selectedOption();
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </FormField>
          <FormField formLabel="Financial Entity (Company)">
            <Select
              class="w-full"
              placeholder="Select financial entity"
              optionValue="value"
              optionTextValue="label"
              options={staticInfo.entities.map((entity) => {
                const name = typeof entity[2] === "string" ? entity[2] : "N/A";
                return {
                  label: name,
                  value: entity[0],
                };
              })}
              itemComponent={(props) => (
                <SelectItem item={props.item}>
                  {props.item.rawValue.label}
                </SelectItem>
              )}
            >
              <SelectTrigger>
                <SelectValue<{ label: string; value: number }>>
                  {(state) => {
                    props.setFormInfo(
                      "financialEntityId",
                      state.selectedOption().value
                    );
                    return state.selectedOption().label;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
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
          <div class="col-span-2">
            <FormField>
              <Button
                size="lg"
                type="submit"
                disabled={
                  !props.formInfo.name ||
                  !!props.formInfo.accountId ||
                  !!errors.accountName
                }
              >
                Create Account
              </Button>
            </FormField>
          </div>
        </div>
      </fieldset>
    </form>
  );
};
