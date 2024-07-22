export type TransactionTag = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type CreateTransactionTagDto = {
  $name: string;
};

export const defaultTags = {
  salary: "Salary",
  dining: "Dining",
  travel: "Travel",
  groceries: "Groceries",
  cpf: "CPF",
  tax: "Tax",
  transport: "Transport",
  healthcare: "Healthcare",
  fitness: "Fitness",
  leisure: "Leisure",
  shopping: "Shopping",
};
