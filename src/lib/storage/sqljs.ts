import initSqlJs, { Database, SqlValue } from "sql.js";

import sqlJsWasmUrl from "/sql-wasm.wasm?url";
import { createEffect, createResource, createRoot } from "solid-js";
import {
  Account,
  AccountType,
  FinancialEntity,
  FinancialTransaction,
  TransactionMethod,
  TransactionMethodModel,
  TransactionType,
  TransactionTypeModel,
} from "./sql";
import { createStore } from "solid-js/store";
import { TransactionTag, TransactionTagModel } from "./sql/TransactionTags";

const initialiseOpfsFile = async () => {
  const opfsRoot = await navigator.storage.getDirectory();
  const fileHandle = await opfsRoot.getFileHandle("sql-test.db", {
    create: true,
  });
  return await fileHandle.getFile();
};

export const persistDB = async (db: Database) => {
  const binaryArray = db.export();

  const blob = new Blob([binaryArray], { type: "application/octet-stream" });

  const ofpsRoot = await navigator.storage.getDirectory();
  const fileHandle = await ofpsRoot.getFileHandle("sql-test.db");
  const writableStream = await fileHandle.createWritable();
  await writableStream.write(blob);
  await writableStream.close();
  console.log("Persisted DB");
};

const initTables = (db: Database) => {
  AccountType.initTable(db);
  FinancialEntity.initTable(db);
  Account.initTable(db);
  TransactionMethod.initTable(db);
  TransactionType.initTable(db);
  FinancialTransaction.initTable(db);
  TransactionTag.initTable(db);
};

const mountDB = async () => {
  try {
    const SQL = await initSqlJs({ locateFile: () => sqlJsWasmUrl });
    const data = await initialiseOpfsFile();
    if (!data.size) {
      console.log("Initialising DB");
      const emptyDB = new SQL.Database();
      initTables(emptyDB);
      await persistDB(emptyDB);
      return emptyDB;
    } else {
      console.log("Restoring DB from system");
      const arrBuffer = await data.arrayBuffer();
      const view = new Uint8Array(arrBuffer);
      return new SQL.Database(view);
    }
  } catch (error) {
    console.log(error);
  }
};

export type staticInfo = {
  entities: SqlValue[][];
  accounts: SqlValue[][];
  transactionMethods: Map<string, TransactionMethodModel>;
  transactionTypes: Map<string, TransactionTypeModel>;
  accountTypes: SqlValue[][];
  transactionTags: TransactionTagModel[];
};

const mapTransactionMethods = (methods: TransactionMethodModel[]) => {
  const methodMap = new Map();
  for (const method of methods) {
    methodMap.set(method.name, method);
  }
  return methodMap;
};

const mapTransactionTypes = (types: TransactionTypeModel[]) => {
  const typeMap = new Map();
  for (const type of types) {
    typeMap.set(type.name, type);
  }
  return typeMap;
};
const createLocalDB = () => {
  const [database, { refetch }] = createResource(mountDB);

  const [staticInfo, setStaticInfo] = createStore<staticInfo>({
    entities: [],
    accounts: [],
    transactionMethods: new Map(),
    transactionTypes: new Map(),
    accountTypes: [],
    transactionTags: [],
  });

  createEffect(() => {
    const db = database();
    if (db) {
      setStaticInfo("entities", FinancialEntity.selectAll?.(db) ?? []);
      setStaticInfo("accounts", Account.selectAll?.(db) ?? []);
      setStaticInfo(
        "transactionMethods",
        mapTransactionMethods(TransactionMethod.selectAll?.(db) ?? [])
      );
      setStaticInfo(
        "transactionTypes",
        mapTransactionTypes(TransactionType.selectAll?.(db) ?? [])
      );
      setStaticInfo("accountTypes", AccountType.selectAll?.(db) ?? []);
      setStaticInfo("transactionTags", TransactionTag.selectAll(db));
    }
  });

  return { database, staticInfo, refetch };
};

export default createRoot(createLocalDB);
