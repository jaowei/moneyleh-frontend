import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

import { Accessor, createSignal, JSX, Setter } from "solid-js";
import {
  FileInput,
  Button,
  DataGrid,
  StatementFormatSelector,
  Statement,
} from "../../components";
import { ParsedResult, RowData } from "../../types";
import { EMPTY_PARSED_RESULT } from "../../constants";
import toast from "solid-toast";

interface LandingDemoProps {
  ref: any;
  filePassword: Accessor<string | undefined>;
  setFilePassword: Setter<string | undefined>;
  setPasswordDialogIsOpen: Setter<boolean>;
}

const LandingDemo = (props: LandingDemoProps) => {
  const [docFormat, setDocFormat] = createSignal<string>();
  const [parsedResult, setParsedResult] =
    createSignal<ParsedResult<RowData>>(EMPTY_PARSED_RESULT);
  const [gridRef, setGridRef] = createSignal<any>(null);

  const handleStatementChange = (statement: Statement) => {
    setDocFormat(statement.label);
  };

  const onClickCopyAll: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(
        gridRef()?.api?.getDataAsCsv({
          columnSeparator: "\t",
          skipColumnHeaders: true,
        })
      );
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy data");
    }
  };

  const onClickDownload: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (e) => {
    e.preventDefault();
    try {
      gridRef()?.api?.exportDataAsCsv();
      toast.success("Downloaded!");
    } catch (error) {
      toast.error("Failed to download, please try again.");
    }
  };

  return (
    <section ref={props.ref}>
      <div class="flex flex-row px-6 gap-8 h-screen items-center pb-2 pt-10">
        <div class="flex-none h-full w-1/4">
          <div class="flex flex-col gap-16 items-center">
            <div>
              <div class="pb-2" text="cyan-900">
                Select your statement format:
              </div>
              <StatementFormatSelector
                onStatementChange={handleStatementChange}
              />
            </div>
            <FileInput
              dataSetter={setParsedResult}
              docFormat={docFormat}
              password={props.filePassword}
              passwordDialogTriggerSetter={props.setPasswordDialogIsOpen}
              passwordSetter={props.setFilePassword}
            />
            <div class="flex justify-between max-w-max mx-auto" p="b-4">
              <Button
                onClick={onClickCopyAll}
                disabled={!parsedResult()?.data.length}
              >
                <div class="flex flex-row items-center">
                  <div class="i-radix-icons-clipboard" />
                  Copy All
                </div>
              </Button>
              <Button
                onClick={onClickDownload}
                disabled={!parsedResult()?.data.length}
              >
                <div class="flex flex-row items-center">
                  <div class="i-radix-icons-download" />
                  Download as CSV
                </div>
              </Button>
            </div>
            <div>
              <a href="/app/data-entry" class="no-underline">
                <Button size="xl" animate="bounce">
                  <div
                    class="i-radix-icons:enter w-2rem h-2rem pr-2"
                    text="white"
                  />
                  Try the app now!
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div class="flex-auto h-full">
          <DataGrid
            gridRef={gridRef}
            gridRefSetter={setGridRef}
            parsedResult={parsedResult}
          />
        </div>
      </div>
    </section>
  );
};

export default LandingDemo;
