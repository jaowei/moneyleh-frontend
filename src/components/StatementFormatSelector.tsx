interface StatementFormatSelectorProps {
  handleChange: (
    e: Event & {
      currentTarget: HTMLSelectElement;
      target: HTMLSelectElement;
    }
  ) => void;
}

export const StatementFormatSelector = (
  props: StatementFormatSelectorProps
) => {
  return (
    <select
      class="w-full max-w-xs rounded shadow-lg"
      cursor="pointer"
      p="y-1 l-2"
      onChange={(e) => props.handleChange(e)}
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
  );
};
