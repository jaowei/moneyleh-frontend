import { createSignal, JSX } from "solid-js";

import { FileInput, PasswordDialog } from "../../components";
import { ParsedResult } from "../../types";
import {
  ACCEPTED_FILE_TYPES,
  EMPTY_PARSED_RESULT,
  FILE_PROCESSING_ERROR,
  NO_FILE_SELECTED_MSG,
} from "../../constants";
import toast from "solid-toast";
import { routeToParsers } from "~/lib/parsers/fileHandler";
import { FinancialTransactionView } from "~/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { exportAsCSV } from "~/utils/csv";
import { unparse } from "papaparse";
import { DataGrid } from "~/components/DataGrid/DataGrid";

const LandingDemo = () => {
  const [savedFile, setSavedFile] = createSignal<File>();
  const [fileName, setFileName] = createSignal(NO_FILE_SELECTED_MSG);
  const [filePassword, setFilePassword] = createSignal<string>();
  const [parsedResult, setParsedResult] =
    createSignal<ParsedResult<FinancialTransactionView>>(EMPTY_PARSED_RESULT);
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);
  const [previewDialogIsOpen, setPreviewDialogIsOpen] = createSignal(false);

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
        undefined,
        undefined
      );
      if (!rowData) {
        throw new Error();
      }
      setParsedResult({ format: "", data: rowData as any });
      setFileName(file?.name ?? "");
      setPreviewDialogIsOpen(true);
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
    <section class="col-span-2 row-span-3">
      <div class="flex items-center justify-center h-full">
        <FileInput
          fileInputAccept={ACCEPTED_FILE_TYPES}
          onFileDrop={handleDrop}
          onFileInputChange={handleInputChange}
        />
      </div>
      <Dialog
        open={previewDialogIsOpen()}
        onOpenChange={setPreviewDialogIsOpen}
      >
        <DialogContent class="max-w-[90%] max-h-[90%]">
          <DialogHeader>
            <DialogTitle>Preview Data</DialogTitle>
            <div class="grid grid-cols-[max-content_min-content] w-9/12 xl:w-[98%] p-2 gap-2">
              <div class="font-semibold text-gray-800">File Name:</div>
              <div class="font-bold">{fileName()}</div>
              {/* <div class="font-semibold text-gray-800">Format Detected:</div>
              <div class="font-bold">Format</div> */}
            </div>
            <div class="w-9/12 xl:w-[98%] max-h-[35rem] border rounded-xl">
              <DataGrid rowData={parsedResult} />
            </div>
          </DialogHeader>
          <DialogFooter class="w-9/12 xl:w-[98%]">
            <Button onClick={handleCopyClick}>Copy</Button>
            <Button onClick={handleExportClick}>Export as CSV</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PasswordDialog
        isOpen={passwordDialogIsOpen}
        onDialogOpenChange={handlePasswordDialogOpenChange}
        onPasswordSubmit={handlePasswordSubmit}
      />
    </section>
  );
};

export default LandingDemo;
