import { Accessor, createSignal, JSX, Setter } from "solid-js";
import {
  LandingFormSection,
  LandingFormSectionText,
  LandingFormSectionContent,
  FileInput,
  DataGrid,
} from "../../components";
import { RowData } from "../../types";
import { StatementFormatsEnum } from "../../constants";

interface LandingDemoProps {
  filePassword: Accessor<string | undefined>;
  setFilePassword: Setter<string | undefined>;
  setPasswordDialogIsOpen: Setter<boolean>;
}

export const LandingDemo = (props: LandingDemoProps) => {
  const [fileName, setFileName] = createSignal("No file selected");
  const [docFormat, setDocFormat] = createSignal<string>(
    StatementFormatsEnum.DBS_CARD
  );
  const [rowData, setRowData] = createSignal<Array<RowData>>();

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

  return (
    <>
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
                  password={props.filePassword}
                  passwordDialogTriggerSetter={props.setPasswordDialogIsOpen}
                  passwordSetter={props.setFilePassword}
                />
              </LandingFormSectionContent>
            </LandingFormSection>
            <LandingFormSection>
              <LandingFormSectionText primaryText="3. Process File" />
              <LandingFormSectionContent>
                <div class="flex flex-row items-center">
                  <div class="i-radix-icons-file" />
                  <div p="l-2 r-4">{fileName()}</div>
                </div>
              </LandingFormSectionContent>
            </LandingFormSection>
          </form>
        </section>
      </div>
      <section class="w-full max-w-7xl h-full mx-auto">
        <DataGrid rowData={rowData} />
      </section>
    </>
  );
};
