import { SqlValue } from "sql.js";
import initDB from "../../../lib/storage/sqljs";
import { createEffect, createSignal } from "solid-js";
import { formInfo } from "./DataEntry";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "~/components/ui/tabs";
import { AccountForm } from "./AccountForm";
import { SetStoreFunction } from "solid-js/store";
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxTrigger,
} from "~/components/ui/combobox";

export interface AccountSelectorState {
  label: string;
  value: SqlValue[];
}

interface AccountSelectorProps {
  formInfo: formInfo;
  setFormInfo: SetStoreFunction<formInfo>;
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

  const handleAccountSelected = (state: AccountSelectorState | null) => {
    const account = state?.value;
    const label = state?.label;
    props.setFormInfo("accountId", (account?.[0] as string) ?? "");
    props.setFormInfo("type", (account?.[3] as string) ?? "");
    props.setFormInfo("name", label ?? "");
    setValue(state);
  };

  return (
    <div class="flex items-center justify-center h-full">
      <Tabs defaultValue="existing" class="border p-6 rounded-xl">
        <TabsList>
          <TabsTrigger value="existing">Select existing account</TabsTrigger>
          <TabsTrigger value="new">Create new account</TabsTrigger>
        </TabsList>
        <TabsContent value="existing">
          <div class="w-full bg-gray-100 p-6 rounded-xl border">
            <Combobox
              class="bg-white"
              value={value()}
              onChange={handleAccountSelected}
              options={staticInfo.accounts.map((account) => {
                return {
                  label: typeof account[2] === "string" ? account[2] : "N/A",
                  value: account,
                };
              })}
              placeholder="select existing account"
              optionValue="value"
              optionTextValue="label"
              itemComponent={(props) => (
                <ComboboxItem item={props.item}>
                  <ComboboxItemLabel>
                    {props.item.rawValue.label}
                  </ComboboxItemLabel>
                </ComboboxItem>
              )}
            >
              <ComboboxControl>
                <ComboboxInput />
                <ComboboxTrigger />
              </ComboboxControl>
              <ComboboxContent class="max-h-96 overflow-auto" />
            </Combobox>
          </div>
        </TabsContent>
        <TabsContent value="new">
          <AccountForm
            formInfo={props.formInfo}
            setFormInfo={props.setFormInfo}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
