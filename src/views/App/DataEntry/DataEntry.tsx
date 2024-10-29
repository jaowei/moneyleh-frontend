import { createSignal, JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import {
  AccountTypes,
  FinancialTransaction,
  FinancialTransactionView,
} from "../../../lib/storage";
import initDB from "../../../lib/storage/sqljs";
import { DataGridLite, FileInput, PasswordDialog } from "../../../components";
import {
  ACCEPTED_FILE_TYPES,
  EMPTY_PARSED_RESULT,
  FILE_PROCESSING_ERROR,
  NO_FILE_SELECTED_MSG,
} from "../../../constants";
import { ParsedResult } from "../../../types";
import toast from "solid-toast";
import { financialTransactionsMapper } from "../../../lib/storage/utils";
import { Header } from "./Header";
import { routeToParsers } from "~/lib/parsers/fileHandler";
import { unparse } from "papaparse";
import { exportAsCSV } from "~/utils/csv";
import { AccountSelector } from "./AccountSelector";

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
  const [savedFile, setSavedFile] = createSignal<File>();
  const [fileName, setFileName] = createSignal(NO_FILE_SELECTED_MSG);
  const [filePassword, setFilePassword] = createSignal<string>();
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);
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

  const handleFileType = async (
    file: File | undefined,
    event?: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) => {
    try {
      const rowData = await routeToParsers(
        file,
        filePassword(),
        formInfo?.accountId,
        formInfo?.type
      );
      console.log(rowData);
      if (!rowData) {
        throw new Error();
      }
      setParsedResult({ format: "", data: rowData as any });
      setFileName(file?.name ?? "");
    } catch (error: any) {
      if (error?.name === "PasswordException") {
        toast.error("Incorrect/No Password");
        setPasswordDialogIsOpen(true);
        setSavedFile(file);
        setFileName(file?.name ?? NO_FILE_SELECTED_MSG);
        return;
      }
      toast.error(FILE_PROCESSING_ERROR);
      setSavedFile();
      setFilePassword();
      setFileName(NO_FILE_SELECTED_MSG);
      if (event?.target?.value) {
        event.target.value = "";
      }
    }
  };

  const handleInputChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = (event) => {
    setParsedResult(EMPTY_PARSED_RESULT);
    setFileName("");
    const file = event.target.files?.[0];
    setSavedFile(file);
    handleFileType(file, event);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setParsedResult(EMPTY_PARSED_RESULT);
    setFileName("");
    const file = e.dataTransfer?.files[0];
    setSavedFile(file);
    handleFileType(file);
  };

  const handlePasswordDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFileName(NO_FILE_SELECTED_MSG);
      setSavedFile();
    }
    setPasswordDialogIsOpen(isOpen);
  };

  const handlePasswordSubmit = (password: string) => {
    if (password) {
      setFilePassword(password);
      handleFileType(savedFile());
    }
  };

  const handleCopyClick = async () => {
    try {
      const data = unparse(parsedResult().data);
      await navigator.clipboard.writeText(data);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Error copying");
    }
  };

  const handleExportClick = () => {
    try {
      const data = unparse(parsedResult().data);
      exportAsCSV(data, `parsed-${fileName()}`);
      toast.success("Exported as CSV!");
    } catch (error) {
      toast.error("Error exporting");
    }
  };

  return (
    <div class="grid grid-rows-[min-content_1fr] h-screen">
      <Header
        fileName={fileName()}
        isDisabled={!(parsedResult().data.length && formInfo.accountId)}
        onSaveClick={handleSubmitTransactions}
        formInfo={formInfo}
        onCopyClick={handleCopyClick}
        onExportClick={handleExportClick}
      />
      {formInfo.accountId ? (
        <Show
          when={parsedResult().data.length}
          fallback={
            <div class="flex justify-center items-center h-[75%]">
              <FileInput
                onFileInputChange={handleInputChange}
                fileInputAccept={ACCEPTED_FILE_TYPES}
                onFileDrop={handleDrop}
              />
            </div>
          }
        >
          <DataGridLite rowData={parsedResult} />
        </Show>
      ) : (
        <AccountSelector formInfo={formInfo} setFormInfo={setFormInfo} />
      )}
      <PasswordDialog
        isOpen={passwordDialogIsOpen}
        onDialogOpenChange={handlePasswordDialogOpenChange}
        onPasswordSubmit={handlePasswordSubmit}
      />
    </div>
  );
};
