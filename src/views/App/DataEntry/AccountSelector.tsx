import { SqlValue } from "sql.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import initDB from "../../../lib/storage/sqljs";
import { createEffect, createSignal } from "solid-js";
import { formInfo } from "./DataEntry";

export interface AccountSelectorState {
  label: string;
  value: SqlValue[];
}

interface AccountSelectorProps {
  formInfo: formInfo;
  onAccountSelected: (state: AccountSelectorState | null) => void;
}

export const AccountSelector = (props: AccountSelectorProps) => {
  const { staticInfo } = initDB;
  const [value, setValue] = createSignal<AccountSelectorState | null>();

  createEffect(() => {
    if (props.formInfo.name) {
      const account = staticInfo.accounts.find(
        (account) => account[2] === props.formInfo.name
      );
      if (account) {
        setValue({
          label: typeof account[2] === "string" ? account[2] : "N/A",
          value: account,
        });
      }
    }
  });

  const handleAccountSelected = (value: AccountSelectorState | null) => {
    props.onAccountSelected(value);
    setValue(value);
  };

  return (
    <Select<AccountSelectorState>
      class="w-full bg-white"
      value={value()}
      onChange={handleAccountSelected}
      options={staticInfo.accounts.map((account) => {
        return {
          label: typeof account[2] === "string" ? account[2] : "N/A",
          value: account,
        };
      })}
      disabled={!staticInfo.accounts.length}
      optionValue="value"
      optionTextValue="label"
      placeholder="select existing account"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
      )}
    >
      <SelectTrigger>
        <SelectValue<AccountSelectorState>>
          {(state) => {
            const label = state.selectedOption().label;
            return label;
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="h-96 overflow-auto" />
    </Select>
  );
};
