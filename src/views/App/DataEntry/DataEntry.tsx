import { For, Show, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import {
  FinancialTransaction,
  FinancialTransactionView,
} from "../../../lib/storage";
import initDB from "../../../lib/storage/sqljs";
import {
  DataGridLite,
  FileInput,
  FormField,
  PasswordDialog,
  PrimaryButton,
  Select,
  StatementFormatSelector,
} from "../../../components";
import { EMPTY_PARSED_RESULT, StatementFormatsEnum } from "../../../constants";
import { ParsedResult } from "../../../types";
import toast from "solid-toast";
import { financialTransactionsMapper } from "../../../lib/storage/utils";
import { AccountForm } from "./AccountForm";

export type formInfo = {
  name: string;
  type: string;
  financialEntityId: string;
  startingBalance: number;
  docFormat: string;
  accountId: string;
};

export const DataEntry = () => {
  const { database, staticInfo } = initDB;
  const [formInfo, setFormInfo] = createStore<formInfo>({
    name: "",
    type: "cash",
    financialEntityId: "1",
    startingBalance: 0,
    docFormat: StatementFormatsEnum.DBS_CARD as string,
    accountId: "",
  });
  const [parsedResult, setParsedResult] =
    createSignal<ParsedResult<FinancialTransactionView>>(EMPTY_PARSED_RESULT);
  const [filePassword, setFilePassword] = createSignal<string>();
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);

  let dialogRef!: HTMLDialogElement;

  const handleDocSelector = (
    event: Event & {
      currentTarget: HTMLSelectElement;
      target: HTMLSelectElement;
    }
  ) => {
    const selectedIdx = event?.target?.selectedIndex;
    const option = event?.target?.options[selectedIdx];
    const optGroup = option.parentElement;
    const category = optGroup?.getAttribute("id");
    setFormInfo("docFormat", `${option.value}-${category}`);
  };

  const handleSubmitTransactions = () => {
    if (!formInfo.accountId) {
      toast.error("Please select an account");
      return;
    }
    const db = database();
    const results = parsedResult();
    if (db && results.data.length) {
      try {
        const convertedData = financialTransactionsMapper(
          results.data,
          staticInfo,
          formInfo.accountId!
        );
        FinancialTransaction?.insertMany?.(db, convertedData);
        setParsedResult(EMPTY_PARSED_RESULT);
        toast.success(
          `Successfully created added transactions to account ${formInfo.name}`,
          {
            position: "top-center",
          }
        );
      } catch (error) {
        console.log(error);
        toast.error("Error inserting into DB", { position: "top-center" });
      }
    } else {
      toast.error("Error with DB / No data", { position: "top-center" });
    }
  };

  return (
    <div class="flex flex-col w-full h-full items-center">
      <div class="flex gap-16 p-6 justify-center items-start">
        <div class="flex flex-col gap-4">
          <FormField formLabel="You are entering transactions for account:">
            <Select
              onChange={(e) => {
                const accountId = e.target.value;
                const accountIdIdx = parseInt(accountId) - 1;
                if (accountId) {
                  setFormInfo("accountId", accountId);
                  setFormInfo(
                    "type",
                    staticInfo.accounts[accountIdIdx][3] as string
                  );
                  setFormInfo(
                    "name",
                    staticInfo.accounts[accountIdIdx][2] as string
                  );
                } else {
                  setFormInfo("accountId", "");
                  setFormInfo("name", "");
                }
              }}
            >
              <option value={""}>select existing account</option>
              <For each={staticInfo.accounts}>
                {(account) => {
                  const name =
                    typeof account[2] === "string" ? account[2] : "N/A";
                  return <option value={account[0] as string}>{name}</option>;
                }}
              </For>
            </Select>
          </FormField>{" "}
          <PrimaryButton
            class="inline-flex h-8 items-center justify-center rounded-xl hover:shadow-md"
            onClick={() => {
              if (dialogRef.open) {
                dialogRef.close();
              } else {
                dialogRef.showModal();
              }
            }}
          >
            Create new account
          </PrimaryButton>
        </div>
        <FormField formLabel="Select Statement Format:">
          <StatementFormatSelector handleChange={handleDocSelector} />
        </FormField>
        <div class="w-sm">
          <FileInput
            dataSetter={setParsedResult}
            password={filePassword}
            passwordDialogTriggerSetter={setPasswordDialogIsOpen}
            passwordSetter={setFilePassword}
            formInfo={formInfo}
          />
        </div>
      </div>
      <div class="flex flex-col gap-6 p-6 items-center">
        <DataGridLite rowData={parsedResult} />
      </div>
      <div class="flex flex-col gap-6 p-6 items-center">
        <PrimaryButton
          onClick={handleSubmitTransactions}
          disabled={!parsedResult().data.length}
        >
          Submit transactions
        </PrimaryButton>
      </div>
      <PasswordDialog
        passwordDialogTrigger={passwordDialogIsOpen}
        passwordDialogTriggerSetter={setPasswordDialogIsOpen}
        passwordSetter={setFilePassword}
      />
      <dialog ref={dialogRef} class="rounded-lg p-6" border="none">
        <div class="flex flex-col gap-6">
          <button
            class="flex rounded-full bg-transparent items-center w-fit h-fit self-end hover:bg-gray-1"
            border="none"
            onClick={() => {
              dialogRef.close();
            }}
          >
            <div class="i-radix-icons:cross-2 w-30px h-30px" />
          </button>
          <Show when={!database.loading} fallback={<div>Loading....</div>}>
            <AccountForm formInfo={formInfo} setFormInfo={setFormInfo} />
          </Show>
        </div>
      </dialog>
    </div>
  );
};
