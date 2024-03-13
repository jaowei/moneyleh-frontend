import { Accessor, createSignal, JSX, Setter } from "solid-js";
import { FileInput, DataGrid, PrimaryButton } from "../../components";
import { ParsedResult } from "../../types";
import { StatementFormatsEnum } from "../../constants";
import toast from "solid-toast";

interface LandingDemoProps {
  ref: any;
  filePassword: Accessor<string | undefined>;
  setFilePassword: Setter<string | undefined>;
  setPasswordDialogIsOpen: Setter<boolean>;
}

export const LandingDemo = (props: LandingDemoProps) => {
  const [fileName, setFileName] = createSignal("No file selected");
  const [docFormat, setDocFormat] = createSignal<string>(
    StatementFormatsEnum.DBS_CARD
  );
  const [parsedResult, setParsedResult] = createSignal<ParsedResult>();
  const [gridRef, setGridRef] = createSignal<any>(null);

  const handleSelectChange: JSX.ChangeEventHandlerUnion<
    HTMLSelectElement,
    Event
  > = (event) => {
    const selectedIdx = event.target.selectedIndex;
    const option = event.target.options[selectedIdx];
    const optGroup = option.parentElement;
    const category = optGroup?.getAttribute("id");
    setDocFormat(`${option.value}-${category}`);
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
        <div class="flex-none h-full">
          <div class="flex flex-col gap-16">
            <div>
              <div class="pb-2" text="cyan-900">
                Select your statement format:
              </div>
              <select
                class="w-full max-w-xs rounded shadow-lg"
                cursor="pointer"
                p="y-1 l-2"
                onChange={handleSelectChange}
              >
                <optgroup id="creditcard" label="Credit Card Statements">
                  <option value="dbs">DBS - PDF</option>
                  <option value="citi">Citibank - PDF</option>
                  <option value="uob">UOB - XLS</option>
                  <option value="hsbc">HSBC - CSV</option>
                </optgroup>
                <optgroup id="account" label="Accounts">
                  <option value="dbs">DBS - CSV</option>
                  <option value="dbs-NAV">DBS NAV - CSV</option>
                  <option value="moomoo">MooMoo - PDF</option>
                  <option value="ibkr">IBKR - CSV</option>
                </optgroup>
              </select>
            </div>
            <FileInput
              dataSetter={setParsedResult}
              fileNameSetter={setFileName}
              docFormat={docFormat}
              password={props.filePassword}
              passwordDialogTriggerSetter={props.setPasswordDialogIsOpen}
              passwordSetter={props.setFilePassword}
            />
            <div class="flex justify-between max-w-max mx-auto" p="b-4">
              <PrimaryButton
                onClick={onClickCopyAll}
                disabled={!parsedResult()?.data.length}
              >
                <div class="flex flex-row items-center">
                  <div class="i-radix-icons-clipboard" />
                  Copy All
                </div>
              </PrimaryButton>
              <PrimaryButton
                onClick={onClickDownload}
                disabled={!parsedResult()?.data.length}
              >
                <div class="flex flex-row items-center">
                  <div class="i-radix-icons-download" />
                  Download as CSV
                </div>
              </PrimaryButton>
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
