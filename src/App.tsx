import * as pdfjsLib from "pdfjs-dist";
import { JSX, createResource, createSignal } from "solid-js";
import { sendPDFText } from "./utils/pdf";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import {
  DataGrid,
  FileInput,
  LandingFormSectionText,
  RowData,
  Wave,
} from "./components";

pdfjsLib.GlobalWorkerOptions.workerSrc = `../../node_modules/pdfjs-dist/build/pdf.worker.mjs`;

function App() {
  const [docFormat, setDocFormat] = createSignal<string>("dbs-creditcard");
  const [pdfTextData, setPdfTextData] =
    createSignal<Array<TextItem | TextMarkedContent>>();
  const [rowData, setRowData] = createSignal<Array<RowData>>();
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
    HTMLInputElement,
    MouseEvent
  > = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    const data = pdfTextData();
    const layoutType = docFormat();
    if (!data) return; // TODO: throw error toast
    if (!layoutType) return; // TODO: throw error toast
    const response = await sendPDFText(data, layoutType);
    setRowData(response);
    setIsProcessing(false);
  };
  return (
    <main class="flex flex-col items-center w-full h-full">
      <Wave />
      <header text="gray-800 center" m="t-36 b-16">
        <h1 text="cyan-900" font="extrabold">
          MoneyLeh💵
        </h1>
        <h4 text="gray-700" font="medium">
          Validate + Extract your credit card/bank statements
        </h4>
      </header>
      <section class="flex w-full justify-center max-w-7xl h-full">
        <form class="flex flex-col w-full justify-center" p="l-24 r-4">
          <div class="flex flex-row items-center" p="x-8 b-16">
            <LandingFormSectionText
              primaryText="1. Select Statement Type"
              secondaryText="*Converts PDF Statements to CSV format"
            />
            <div class="relative w-full flex flex-row justify-center">
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
            </div>
          </div>
          <div class="flex flex-row items-center h-full" p="x-8 b-16">
            <LandingFormSectionText primaryText="2. Select File" />
            <div class="flex flex-row justify-center w-full">
              <FileInput dataSetter={setPdfTextData} />
            </div>
          </div>
          <div class="flex flex-row items-center h-full" p="x-8 b-16">
            <LandingFormSectionText primaryText="3. Process File" />
            <div class="flex flex-row justify-center w-full h-full">
              <input
                type="submit"
                value={isProcessing() ? "Processing..." : "Process File"}
                onClick={handleSubmit}
                disabled={!pdfTextData()}
                class={`rounded font-sans ${
                  !pdfTextData() ? "" : "hover:bg-cyan-700"
                }`}
                bg={!pdfTextData() ? "gray-500" : "cyan-900"}
                text="white sm"
                border="~ solid black"
                p="y-2 x-2"
                cursor={!pdfTextData() ? "not-allowed" : "pointer"}
              ></input>
            </div>
          </div>
        </form>
      </section>
      <section class="flex w-full justify-center max-w-7xl h-full">
        <DataGrid rowData={rowData} />
      </section>
    </main>
  );
}

export default App;
