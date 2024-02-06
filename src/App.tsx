import * as pdfjsLib from "pdfjs-dist";
import { JSX, Show, createSignal } from "solid-js";
import { sendPDFText } from "./utils/pdf";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import {
  DataGrid,
  FileInput,
  LandingFormSection,
  LandingFormSectionContent,
  LandingFormSectionText,
  PrimaryButton,
  RowData,
  Spinner,
  Wave,
} from "./components";
import toast, { Toaster } from "solid-toast";
import { FILE_PROCESSING_ERROR } from "./constants";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

type AppProps = {
  worker: Worker;
};

function App(props: AppProps) {
  //refs
  const [dataGridRef, setDataGridRef] = createSignal<HTMLDivElement>();

  const [docFormat, setDocFormat] = createSignal<string>("dbs-creditcard");
  const [pdfTextData, setPdfTextData] =
    createSignal<Array<TextItem | TextMarkedContent>>();
  const [rowData, setRowData] = createSignal<Array<RowData>>();
  const [fileName, setFileName] = createSignal("No file selected");

  // loading
  const [isProcessing, setIsProcessing] = createSignal(false);

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

  const handleSubmit: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    const data = pdfTextData();
    const layoutType = docFormat();
    const dataDisplaySectionRef = dataGridRef();
    if (!data) {
      toast.error(FILE_PROCESSING_ERROR);
      return;
    }
    if (!layoutType) {
      toast.error(FILE_PROCESSING_ERROR);
      return;
    }
    try {
      const response = await sendPDFText(data, layoutType);
      setRowData(response);
      if (dataDisplaySectionRef) {
        dataDisplaySectionRef.scrollIntoView({ behavior: "smooth" });
      }
      toast.success("File processed successfully");
    } catch (error) {
      toast.error(FILE_PROCESSING_ERROR);
    }
    setIsProcessing(false);
  };

  return (
    <main class="flex flex-col items-center w-full h-full">
      <Toaster position="bottom-right" />
      <Wave />
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
          Extract your PDF credit card statements to CSV
        </h4>
      </header>
      <section class="flex w-full max-w-7xl h-full">
        <form class="flex flex-col w-full justify-center sm:px-6">
          <LandingFormSection>
            <LandingFormSectionText
              primaryText="1. Select Statement Type"
              secondaryText="*Converts PDF Statements to CSV format"
            />
            <LandingFormSectionContent>
              <select
                class="w-full max-w-xs rounded shadow-lg"
                cursor="pointer"
                p="y-1 l-2"
                onChange={handleSelectChange}
              >
                <optgroup id="creditcard" label="Credit Card Statements">
                  <option value="dbs">DBS - Development Bank Singapore</option>
                  <option value="citi">Citibank - Singapore</option>
                </optgroup>
              </select>
            </LandingFormSectionContent>
          </LandingFormSection>
          <LandingFormSection>
            <LandingFormSectionText primaryText="2. Select File" />
            <LandingFormSectionContent>
              <FileInput
                dataSetter={setPdfTextData}
                fileNameSetter={setFileName}
              />
            </LandingFormSectionContent>
          </LandingFormSection>
          <LandingFormSection>
            <LandingFormSectionText primaryText="3. Process File" />
            <LandingFormSectionContent>
              <div class="flex flex-row items-center">
                <div class="i-radix-icons-file" />
                <div p="l-2 r-4">{fileName()}</div>
                <Show when={!isProcessing()} fallback={<Spinner />}>
                  <PrimaryButton
                    onClick={handleSubmit}
                    disabled={!pdfTextData()}
                  >
                    Process
                  </PrimaryButton>
                </Show>
              </div>
            </LandingFormSectionContent>
          </LandingFormSection>
        </form>
      </section>
      <section
        class="flex w-full justify-center max-w-7xl h-full"
        ref={setDataGridRef}
      >
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
