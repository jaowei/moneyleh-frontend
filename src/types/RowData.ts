export type RowData = {
  date: string;
  currency: string;
  description: string;
  amount: number;
  transactionCode?: string;
  parentTag?: string;
  childTag?: string;
  account?: string;
};

export type ParsedResult<T> = {
  format: string;
  data: Array<T>;
};
