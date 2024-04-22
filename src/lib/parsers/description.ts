import { baseTransactionMethods, baseTransactionTypes } from "../storage";

const ERROR_VALUE = "";

type TransactionMap = {
  method?: string;
  type?: string;
  subType?: string;
};

// arrange from most specific to most generic terms
const methodMap: Record<string, TransactionMap> = {
  paynow: {
    method: baseTransactionMethods[0],
  },
  paylah: {
    method: baseTransactionMethods[1],
  },
  "bill ccc": {
    method: baseTransactionMethods[2],
    type: baseTransactionTypes[16],
  },
  ccc: {
    method: baseTransactionMethods[2],
    type: baseTransactionTypes[16],
  },
  dbsc: {
    method: baseTransactionMethods[2],
    type: baseTransactionTypes[16],
  },
  salary: {
    method: baseTransactionMethods[2],
  },
  "i-bank": {
    method: baseTransactionMethods[2],
  },
  " si ": { method: baseTransactionMethods[3] }, // standing instruction
  "preferential rate based on total": {
    method: baseTransactionMethods[2],
    type: baseTransactionTypes[11],
  },
};

const typeMap: Record<string, string> = {
  salary: baseTransactionTypes[9],
  "i-bank": baseTransactionMethods[2],
};

/**
 * Parses financial transaction descriptions to it's transfer method,
 * type and subtypes.
 * @param description
 */
const descriptionToTags = (description: string) => {
  let transactionMethod = "";
  let transactionType = "";
  let transactionSubType = "";
  for (let keyword of Object.keys(methodMap)) {
    if (description.toLowerCase().includes(keyword)) {
      transactionMethod = methodMap[keyword]?.method || ERROR_VALUE;
      transactionType =
        methodMap[keyword]?.type || typeMap[keyword] || ERROR_VALUE;
      // TODO: Add map for subtypes
      break;
    }
  }
  return {
    transactionMethod,
    transactionType,
    transactionSubType,
  };
};

export { descriptionToTags };
