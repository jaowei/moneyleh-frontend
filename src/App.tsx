import * as pdfjsLib from "pdfjs-dist";
import { JSX, createSignal } from "solid-js";
import { parsePDF, sendPDFText } from "./utils/pdf";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = `../../node_modules/pdfjs-dist/build/pdf.worker.mjs`;

function App() {
  const [docFormat, setDocFormat] = createSignal<string>();
  const [pdfTextData, setPdfTextData] =
    createSignal<Array<TextItem | TextMarkedContent>>();
  const handleInputChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const pdfTextData = await parsePDF(file);
      setPdfTextData(pdfTextData);
    }
  };

  const handleSelectChange: JSX.ChangeEventHandlerUnion<
    HTMLSelectElement,
    Event
  > = (event) => {
    const selectedIdx = event.target.selectedIndex;
    const option = event.target.options[selectedIdx];
    const optGroup = option.parentElement;
    const category = optGroup?.getAttribute("value");
    setDocFormat(`${option.value}-${category}`);
  };

  const handleSubmit: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (
    event
  ) => {
    event.preventDefault();
    const data = pdfTextData();
    const layoutType = docFormat();
    if (!data) return; // TODO: throw error toast
    if (!layoutType) return; // TODO: throw error toast
    sendPDFText(data, layoutType);
  };
  return (
    <main>
      <header>
        <h1>MoneyLeh 💵</h1>
        <h3>Manage your personal finances...</h3>
      </header>
      <section>
        <h1>Quick Start</h1>
        <h2>Try out our pdf extraction feature below</h2>
        <div>
          <form>
            <label>Convert PDF Statements to CSV format</label>
            <select onChange={handleSelectChange}>
              <optgroup id="creditcard" label="Credit Card Statements">
                <option value="dbs">DBS</option>
                <option value="citi">Citi</option>
                <option value="uob">UOB</option>
              </optgroup>
              <optgroup id="bankstatements" label="Bank Statements">
                <option value="dbs">DBS</option>
                <option value="citi">Citi</option>
                <option value="uob">UOB</option>
              </optgroup>
            </select>
            <input
              type="file"
              onInput={handleInputChange}
              placeholder="Select files"
            ></input>
            <input
              type="submit"
              value="submit"
              onClick={handleSubmit}
              disabled={!pdfTextData()}
            ></input>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
