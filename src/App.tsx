import * as pdfjsLib from "pdfjs-dist";
import { JSX } from "solid-js";
import { parsePDF } from "./utils/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `../../node_modules/pdfjs-dist/build/pdf.worker.mjs`;

function App() {
  const handleChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.time("parsing");
      console.log(await parsePDF(file));
      console.timeEnd("parsing");
    }
  };

  const handleSubmit: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (
    event
  ) => {
    event.preventDefault();
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
            <select>
              <optgroup label="Credit Card Statements">
                <option value="dbs">DBS</option>
                <option value="citi">Citi</option>
                <option value="uob">UOB</option>
              </optgroup>
              <optgroup label="Bank Statements">
                <option value="dbs">DBS</option>
                <option value="citi">Citi</option>
                <option value="uob">UOB</option>
              </optgroup>
            </select>
            <input
              type="file"
              onInput={handleChange}
              placeholder="Select files"
            ></input>
            <input type="submit" value="submit" onClick={handleSubmit}></input>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
