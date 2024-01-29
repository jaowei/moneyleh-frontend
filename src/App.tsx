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
  RowData,
  Spinner,
  Wave,
} from "./components";
import toast, { Toaster } from "solid-toast";
import { FILE_PROCESSING_ERROR } from "./constants";

pdfjsLib.GlobalWorkerOptions.workerSrc = `../../node_modules/pdfjs-dist/build/pdf.worker.mjs`;

function App() {
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
        <h1 text="cyan-900" font="extrabold">
          MoneyLeh💵
        </h1>
        <h4 text="gray-700" font="medium">
          Validate + Extract your credit card/bank statements
        </h4>
      </header>
      <section class="flex w-full max-w-7xl h-full">
        <form class="flex flex-col w-full justify-center">
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
                  <option value="dbs">DBS</option>
                  <option value="citi">Citi</option>
                  <option value="uob">UOB</option>
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
                  <button
                    onClick={handleSubmit}
                    disabled={!pdfTextData()}
                    class={`rounded font-sans ${
                      !pdfTextData() ? "" : "hover:bg-cyan-700"
                    }`}
                    bg={!pdfTextData() ? "gray-500" : "cyan-900"}
                    text="white sm"
                    border="~ solid black"
                    p="y-1 x-2"
                    cursor={!pdfTextData() ? "not-allowed" : "pointer"}
                  >
                    Process
                  </button>
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
    </main>
  );
}

export default App;
