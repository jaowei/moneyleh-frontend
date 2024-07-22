import initSqlJs, { Database, SqlValue } from "sql.js";

import sqlJsWasmUrl from "/sql-wasm.wasm?url";
import { createEffect, createResource, createRoot } from "solid-js";
import {
  Account,
  AccountType,
  FinancialEntity,
  FinancialTransaction,
  TransactionMethod,
  TransactionType,
} from "./sql";
import { createStore } from "solid-js/store";

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
  transactionMethods: SqlValue[][];
  transactionTypes: SqlValue[][];
  accountTypes: SqlValue[][];
};

const createLocalDB = () => {
  const [database, { refetch }] = createResource(mountDB);

  const [staticInfo, setStaticInfo] = createStore<staticInfo>({
    entities: [],
    accounts: [],
    transactionMethods: [],
    transactionTypes: [],
    accountTypes: [],
  });

  createEffect(() => {
    const db = database();
    if (db) {
      setStaticInfo("entities", FinancialEntity.selectAll?.(db) ?? []);
      setStaticInfo("accounts", Account.selectAll?.(db) ?? []);
      setStaticInfo(
        "transactionMethods",
        TransactionMethod.selectAll?.(db) ?? []
      );
      setStaticInfo("transactionTypes", TransactionType.selectAll?.(db) ?? []);
      setStaticInfo("accountTypes", AccountType.selectAll?.(db) ?? []);
    }
  });

  return { database, staticInfo, refetch };
};

export default createRoot(createLocalDB);
