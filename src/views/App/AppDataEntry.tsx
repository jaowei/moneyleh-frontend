import { For, JSX, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import {
  Account,
  FinancialTransaction,
  FinancialTransactionView,
} from "../../lib/storage";
import initDB from "../../lib/storage/sqljs";
import {
  DataGridLite,
  FileInput,
  PasswordDialog,
  PrimaryButton,
  StatementFormatSelector,
} from "../../components";
import { EMPTY_PARSED_RESULT, StatementFormatsEnum } from "../../constants";
import { ParsedResult } from "../../types";
import toast from "solid-toast";
import { financialTransactionsMapper } from "../../lib/storage/utils";
import { AccountTypes } from "../../constants/accountTypes";

export type formInfo = {
  name: string;
  type: string;
  financialEntityId: string;
  startingBalance: number;
  docFormat: string;
  accountId: string;
};

const accountingRelationMap: Record<string, string> = {
  cash: "asset",
  investment: "asset",
  creditCard: "liability",
};

export const AppDataEntry = () => {
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
  const [accountId, setAccountId] = createSignal<string>();

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, Event> = (e) => {
    e.preventDefault();
    const db = database();
    const accountData = {
      $name: formInfo.name,
      $type: formInfo.type,
      $financialEntityId: formInfo.financialEntityId,
      $startingBalance: formInfo.startingBalance,
      $accountingRelation: accountingRelationMap[formInfo.type],
    };
    if (db) {
      try {
        const id = Account.insertOne?.(db, accountData);
        if (id) {
          console.log(id);
          setAccountId(id[0]);
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
    if (!accountId()) {
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
          accountId()!
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
    <div class="flex flex-col w-full h-full gap-10">
      <Show when={!database.loading} fallback={<div>Loading....</div>}>
        <form onSubmit={handleSubmit}>
          <div class="flex gap-6">
            <input
              type="text"
              name="accountName"
              placeholder="Account Name"
              onInput={(e) => setFormInfo("name", e.target.value)}
            />
            <select onChange={(e) => setFormInfo("type", e.target.value)}>
              <option value={AccountTypes.CASH}>Cash</option>
              <option value={AccountTypes.INVESTMENT}>Investment</option>
              <option value={AccountTypes.CREDITCARD}>Credit Card</option>
            </select>
            <select
              onChange={(e) =>
                setFormInfo(
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
            </select>
            <input
              type="number"
              value="0.0"
              step="0.01"
              onChange={(e) =>
                setFormInfo("startingBalance", parseFloat(e.target.value))
              }
            />
            <button type="submit">Create Account</button>
          </div>
        </form>
      </Show>
      <select
        onChange={(e) => {
          const accountId = e.target.value;
          const accountIdIdx = parseInt(accountId) - 1;
          if (accountId) {
            setAccountId(accountId);
            setFormInfo("type", staticInfo.accounts[accountIdIdx][3] as string);
          }
        }}
      >
        <option value={""}>select existing account</option>
        <For each={staticInfo.accounts}>
          {(account) => {
            const name = typeof account[2] === "string" ? account[2] : "N/A";
            return <option value={account[0] as string}>{name}</option>;
          }}
        </For>
      </select>
      <div>Accounts</div>
      <div>
        <FileInput
          dataSetter={setParsedResult}
          password={filePassword}
          passwordDialogTriggerSetter={setPasswordDialogIsOpen}
          passwordSetter={setFilePassword}
          formInfo={formInfo}
        />
      </div>
      <div>
        <StatementFormatSelector handleChange={handleDocSelector} />
      </div>
      <div>
        <DataGridLite rowData={parsedResult} />
      </div>
      <div>
        <PrimaryButton onClick={handleSubmitTransactions}>
          Submit transactions
        </PrimaryButton>
      </div>
      <PasswordDialog
        passwordDialogTrigger={passwordDialogIsOpen}
        passwordDialogTriggerSetter={setPasswordDialogIsOpen}
        passwordSetter={setFilePassword}
      />
    </div>
  );
};
