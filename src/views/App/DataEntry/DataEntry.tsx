import { For, Match, Show, Switch, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import {
  AccountTypes,
  FinancialTransaction,
  FinancialTransactionView,
} from "../../../lib/storage";
import initDB from "../../../lib/storage/sqljs";
import {
  DataGridLite,
  FileInput,
  Statement,
  StatementFormatSelector,
} from "../../../components";
import { EMPTY_PARSED_RESULT } from "../../../constants";
import { ParsedResult } from "../../../types";
import toast from "solid-toast";
import { financialTransactionsMapper } from "../../../lib/storage/utils";
import { AccountForm } from "./AccountForm";
import { SqlValue } from "sql.js";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

export type formInfo = {
  name: string;
  type: string;
  financialEntityId: number;
  startingBalance: number;
  docFormat: string;
  accountId: string;
};

export const DataEntry = () => {
  const { database, staticInfo } = initDB;
  const [formInfo, setFormInfo] = createStore<formInfo>({
    name: "",
    type: AccountTypes.cash,
    financialEntityId: 1,
    startingBalance: 0,
    docFormat: "",
    accountId: "",
  });
  const [parsedResult, setParsedResult] =
    createSignal<ParsedResult<FinancialTransactionView>>(EMPTY_PARSED_RESULT);
  const [openDialog, setOpenDialog] = createSignal(false);

  const handleDocSelector = (statement: Statement) => {
    console.log(statement);
    setFormInfo("docFormat", statement.value);
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
        console.log(convertedData);
        // FinancialTransaction?.insertMany?.(db, convertedData);
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

  const closeDialog = () => {
    if (openDialog()) {
      setOpenDialog((prev) => !prev);
    }
  };

  return (
    <div class="flex flex-col w-full h-screen items-center">
      <Collapsible class="w-full" defaultOpen={true}>
        <CollapsibleContent>
          <div class="bg-gray-50 flex flex-col items-center">
            <div class="flex gap-10 pt-4 pb-2 px-4 justify-center items-start w-full ">
              <Dialog open={openDialog()} onOpenChange={setOpenDialog}>
                <DialogTrigger
                  as={(props: DialogTriggerProps) => (
                    <Button class="w-full" {...props}>
                      Create New Account
                    </Button>
                  )}
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new account</DialogTitle>
                  </DialogHeader>
                  <AccountForm
                    formInfo={formInfo}
                    setFormInfo={setFormInfo}
                    closeForm={closeDialog}
                  />
                </DialogContent>
              </Dialog>
              <Select
                class="w-full bg-white"
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
                  <SelectItem item={props.item}>
                    {props.item.rawValue.label}
                  </SelectItem>
                )}
              >
                <SelectTrigger>
                  <SelectValue<{ label: string; value: SqlValue[] }>>
                    {(state) => {
                      const account = state.selectedOption().value;
                      const label = state.selectedOption().label;
                      setFormInfo("accountId", account[0] as string);
                      setFormInfo("type", account[3] as string);
                      setFormInfo("name", label);
                      return label;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
              <StatementFormatSelector onStatementChange={handleDocSelector} />
              <FileInput dataSetter={setParsedResult} formInfo={formInfo} />
              <Button
                onClick={handleSubmitTransactions}
                disabled={!(parsedResult().data.length && formInfo.accountId)}
              >
                Submit transactions
              </Button>
            </div>
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger class="w-full">
          <div class="bg-gray-100">
            <span class="iconify radix-icons--chevron-up" />
          </div>
        </CollapsibleTrigger>
      </Collapsible>
      <DataGridLite rowData={parsedResult} />
    </div>
  );
};
