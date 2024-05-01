import {
  TransactionMethods,
  TransactionSubTypes,
  TransactionTypes,
} from "../storage";

const ERROR_VALUE = "";

type TransactionMap = {
  method?: string;
  type?: string;
  subType?: string;
};

// arrange from most generic to most specific terms
const methodMap: Record<string, TransactionMap> = {
  "i-bank": {
    method: TransactionMethods.fast,
  },
  paynow: {
    method: TransactionMethods.paynow,
  },
  paylah: {
    method: TransactionMethods.paylah,
  },
  "bill ccc": {
    method: TransactionMethods.fast,
    type: TransactionTypes.billPayment,
  },
  ccc: {
    method: TransactionMethods.fast,
    type: TransactionTypes.billPayment,
  },
  dbsc: {
    method: TransactionMethods.fast,
    type: TransactionTypes.billPayment,
  },
  salary: {
    method: TransactionMethods.fast,
    type: TransactionTypes.salary,
  },
  " si ": { method: TransactionMethods.giro }, // standing instruction
  "preferential rate based on total": {
    method: TransactionMethods.fast,
    type: TransactionTypes.interest,
  },
  "ntuc-mship fee": {
    method: TransactionMethods.cardInstallment,
    type: TransactionTypes.memberships,
    subType: TransactionSubTypes.ntucMembership,
  },
  spotify: {
    method: TransactionMethods.cardInstallment,
    type: TransactionTypes.billPayment,
    subType: TransactionSubTypes.music,
  },
  "gopay-gojek": {
    method: TransactionMethods.cardOnline,
    type: TransactionTypes.transport,
    subType: TransactionSubTypes.rideHailing,
  },
  "grab*": {
    method: TransactionMethods.cardOnline,
    type: TransactionTypes.transport,
    subType: TransactionSubTypes.rideHailing,
  },
  "shopee singapore mp": {
    method: TransactionMethods.cardOnline,
    type: TransactionTypes.shopping,
  },
  "amazon mktplc": {
    method: TransactionMethods.cardOnline,
    type: TransactionTypes.shopping,
  },
};

const typeMap: Record<string, TransactionMap> = {
  "i-bank": {
    type: TransactionTypes.transfer,
  },
  "bus/mrt": {
    type: TransactionTypes.transport,
    subType: TransactionSubTypes.public,
  },
  giga: {
    type: TransactionTypes.billPayment,
    subType: TransactionSubTypes.phonePlan,
  },
  "ezpaysgd*anytime": {
    type: TransactionTypes.fitness,
    subType: TransactionSubTypes.gym,
  },
  causewaylink: {
    type: TransactionTypes.transport,
    subType: TransactionSubTypes.public,
  },
  "diamond kitchen": {
    type: TransactionTypes.dining,
    subType: TransactionSubTypes.restaurant,
  },
  kopifellas: {
    type: TransactionTypes.dining,
    subType: TransactionSubTypes.casualDining,
  },
  "xiang xiang hunan": {
    type: TransactionTypes.dining,
    subType: TransactionSubTypes.restaurant,
  },
  kazuki: {
    type: TransactionTypes.dining,
    subType: TransactionSubTypes.casualDining,
  },
  "old chang kee": {
    type: TransactionTypes.dining,
    subType: TransactionSubTypes.casualDining,
  },
  "sheng siong": {
    type: TransactionTypes.groceries,
  },
  "cold storage": {
    type: TransactionTypes.groceries,
  },
  "venus beauty": {
    type: TransactionTypes.shopping,
    subType: TransactionSubTypes.toiletries,
  },
};

const subTypeMap: Record<string, string> = {};

/**
 * Parses financial transaction descriptions to it's transfer method,
 * type and subtypes.
 * @param description
 */
const descriptionToTags = (description: string) => {
  const desc = description.toLowerCase();

  let transactionMethod = "";
  let transactionType = "";
  let transactionSubType = "";

  const methodKeys = Object.keys(methodMap);
  const typeKeys = Object.keys(typeMap);
  const subTypeKeys = Object.keys(subTypeMap);

  const maxLen = Math.max(
    methodKeys.length,
    typeKeys.length,
    subTypeKeys.length
  );

  for (let i = 0; i < maxLen; i++) {
    const methodKeyword = methodKeys?.[i];
    const typeKeyword = typeKeys?.[i];
    const subTypeKeyword = subTypeKeys?.[i];
    if (methodKeyword && desc.includes(methodKeyword)) {
      transactionMethod = methodMap[methodKeyword]?.method || ERROR_VALUE;
      transactionType = methodMap[methodKeyword]?.type || ERROR_VALUE;
      transactionSubType = methodMap[methodKeyword]?.subType || ERROR_VALUE;
    }
    if (typeKeyword && desc.includes(typeKeyword)) {
      transactionType = typeMap[typeKeyword]?.type || ERROR_VALUE;
      transactionSubType = typeMap[typeKeyword]?.subType || ERROR_VALUE;
    }
    if (subTypeKeyword && desc.includes(subTypeKeyword)) {
      transactionSubType = subTypeMap[subTypeKeyword] || ERROR_VALUE;
    }
  }

  return {
    transactionMethod,
    transactionType,
    transactionSubType,
  };
};

export { descriptionToTags };
