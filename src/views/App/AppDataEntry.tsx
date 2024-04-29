import { For, JSX, Show, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SqlValue } from "sql.js";
import {
  Account,
  FinancialEntity,
  FinancialTransaction,
  FinancialTransactionModel,
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

type formInformation = {
  entities: SqlValue[][];
  accounts: SqlValue[][];
  transactionMethods: SqlValue[][];
  transactionTypes: SqlValue[][];
  transactionSubTypes: SqlValue[][];
};

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
    $financialEntityId: "1",
    $startingBalance: 0,
  });
  const [formInfo, setFormInfo] = createStore<formInformation>({
    entities: [],
    accounts: [],
    transactionMethods: [],
    transactionTypes: [],
    transactionSubTypes: [],
  });
  const [docFormat, setDocFormat] = createSignal<string>(
    StatementFormatsEnum.DBS_CARD
  );
  const [parsedResult, setParsedResult] =
    createSignal<ParsedResult<FinancialTransactionModel>>(EMPTY_PARSED_RESULT);
  const [filePassword, setFilePassword] = createSignal<string>();
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);
  const [accountId, setAccountId] = createSignal<string>();

  createEffect(() => {
    const db = database();
    if (db) {
      const values = db.exec(FinancialEntity.queries.selectAll)[0]?.values;
      setFormInfo("accounts", Account.selectAll?.(db) ?? []);
      setFormInfo("entities", values);
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
    setDocFormat(`${option.value}-${category}`);
  };

  const handleSubmitTransactions = () => {
    console.log(parsedResult(), accountId());
    if (!accountId()) {
      toast.error("Please select an account");
      return;
    }
    const db = database();
    const results = parsedResult();
    if (db && results.data.length) {
      try {
        FinancialTransaction?.insertMany?.(db, results.data);
        setParsedResult(EMPTY_PARSED_RESULT);
        toast.success(
          `Successfully created added transactions to account ${accountDetails.$name}`,
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
                  `${e.target.selectedIndex + 1}`
                )
              }
            >
              <For each={formInfo.entities}>
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
      <div>
        <FileInput
          dataSetter={setParsedResult}
          docFormat={docFormat}
          password={filePassword}
          passwordDialogTriggerSetter={setPasswordDialogIsOpen}
          passwordSetter={setFilePassword}
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
