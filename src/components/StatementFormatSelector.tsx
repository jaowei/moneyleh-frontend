import { StatementFormats } from "../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface StatementFormatSelectorProps {
  onStatementChange: (selected: Statement) => void;
}

export interface Statement {
  value: string;
  label: string;
  disabled: boolean;
}

interface Category {
  label: string;
  id: string;
  options: Array<Statement>;
}

const statementOptions: Array<Category> = [
  {
    label: "Credit Card Statements",
    id: "creditcard",
    options: [
      { value: StatementFormats.DBS_CARD, label: "DBS - PDF", disabled: false },
      {
        value: StatementFormats.CITI_CARD,
        label: "Citibank - PDF",
        disabled: false,
      },
      { value: StatementFormats.UOB_CARD, label: "UOB - XLS", disabled: false },
      {
        value: StatementFormats.HSBC_CARD,
        label: "HSBC - CSV",
        disabled: false,
      },
    ],
  },
  {
    id: "account",
    label: "Accounts",
    options: [
      {
        value: StatementFormats.DBS_ACCOUNT,
        label: "DBS - CSV",
        disabled: false,
      },
      {
        value: StatementFormats.DBS_NAV_ACCOUNT,
        label: "DBS NAV - CSV",
        disabled: false,
      },
      {
        value: StatementFormats.MOOMOO_ACCOUNT,
        label: "MooMoo - PDF",
        disabled: false,
      },
      {
        value: StatementFormats.IBKR_ACCOUNT,
        label: "IBKR - CSV",
        disabled: false,
      },
    ],
  },
];

export const StatementFormatSelector = (
  props: StatementFormatSelectorProps
) => {
  return (
    <Select<Statement, Category>
      class="w-full bg-white"
      options={statementOptions}
      placeholder="Select a statement format"
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      optionGroupChildren="options"
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
      )}
      sectionComponent={(props) => <div>{props.section.rawValue.label}</div>}
    >
      <SelectTrigger>
        <SelectValue<Statement>>
          {(state) => {
            props.onStatementChange(state.selectedOption());
            return state.selectedOption().label;
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};
