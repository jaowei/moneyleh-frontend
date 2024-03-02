import * as pdfjsLib from "pdfjs-dist";
import { JSX, createSignal } from "solid-js";
import {
  DataGrid,
  FileInput,
  LandingFormSection,
  LandingFormSectionContent,
  LandingFormSectionText,
  Wave,
} from "./components";
import { Toaster } from "solid-toast";
import { StatementFormatsEnum } from "./constants";
import { PasswordDialog } from "./components/PasswordDialog";
import { RowData } from "./types";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

type AppProps = {
  worker: Worker;
};

function App(props: AppProps) {
  const [docFormat, setDocFormat] = createSignal<string>(
    StatementFormatsEnum.DBS_CARD
  );
  // const [pdfTextData, setPdfTextData] =
  //   createSignal<Array<TextItem | TextMarkedContent>>();
  const [rowData, setRowData] = createSignal<Array<RowData>>();
  const [fileName, setFileName] = createSignal("No file selected");
  const [filePassword, setFilePassword] = createSignal<string>();
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);

  // loading
  // const [isProcessing, setIsProcessing] = createSignal(false);

  const handleSelectChange: JSX.ChangeEventHandlerUnion<
    HTMLSelectElement,
    Event
  > = (event) => {
    const selectedIdx = event.target.selectedIndex;
    const option = event.target.options[selectedIdx];
    const optGroup = option.parentElement;
    const category = optGroup?.getAttribute("id");
    props.worker.postMessage([category]);
    setDocFormat(`${option.value}-${category}`);
  };

  return (
    <main>
      <Toaster position="bottom-right" />
      <Wave />
      <PasswordDialog
        passwordDialogTrigger={passwordDialogIsOpen}
        passwordDialogTriggerSetter={setPasswordDialogIsOpen}
        passwordSetter={setFilePassword}
      />
      <header text="gray-800 center" m="t-36 b-16">
        <h1
          text="cyan-900"
          font="extrabold"
          class="flex flex-row justify-center items-center"
        >
          <div
            class="i-vaadin:piggy-bank-coin"
            style={{ color: "#164e63" }}
            p="r-2"
          />
          MoneyLeh
        </h1>
        <h4 text="gray-700" font="medium">
          Offline first personal finances tracker
        </h4>
      </header>
      <div class="flex flex-col items-center w-full h-full">
        <section class="flex w-full max-w-7xl h-full">
          <form class="flex flex-col w-full justify-center sm:px-6">
            <LandingFormSection>
              <LandingFormSectionText primaryText="1. Select Statement Type" />
              <LandingFormSectionContent>
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
                    <option value="moomoo">MooMoo - PDF</option>
                    <option value="ibkr">IBKR - CSV</option>
                  </optgroup>
                </select>
              </LandingFormSectionContent>
            </LandingFormSection>
            <LandingFormSection>
              <LandingFormSectionText primaryText="2. Select File" />
              <LandingFormSectionContent>
                <FileInput
                  dataSetter={setRowData}
                  fileNameSetter={setFileName}
                  docFormat={docFormat}
                  password={filePassword}
                  passwordDialogTriggerSetter={setPasswordDialogIsOpen}
                  passwordSetter={setFilePassword}
                />
              </LandingFormSectionContent>
            </LandingFormSection>
            <LandingFormSection>
              <LandingFormSectionText primaryText="3. Process File" />
              <LandingFormSectionContent>
                <div class="flex flex-row items-center">
                  <div class="i-radix-icons-file" />
                  <div p="l-2 r-4">{fileName()}</div>
                  {/* <Show when={!isProcessing()} fallback={<Spinner />}>
                  <PrimaryButton
                    onClick={handleSubmit}
                    disabled={!pdfTextData()}
                  >
                    Process
                  </PrimaryButton>
                </Show> */}
                </div>
              </LandingFormSectionContent>
            </LandingFormSection>
          </form>
        </section>
      </div>
      <section class="w-full max-w-7xl h-full mx-auto">
        <DataGrid rowData={rowData} />
      </section>
      <footer class="flex w-full h-16" bg="cyan-900">
        <div class="flex flex-row items-center" p="x-6">
          <a
            href="https://github.com/jaowei/moneyleh-frontend"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div class="i-fa6-brands:github w-2em h-2em bg-white" />
          </a>
          <div class="flex flex-row items-center" p="l-6">
            <p text="white">Made in</p>
            <div class="i-flag:sg-4x3 w-1em h-1em" p="l-6" />
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
