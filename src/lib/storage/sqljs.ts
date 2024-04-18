import initSqlJs, { Database } from "sql.js";

import sqlJsWasmUrl from "/sql-wasm.wasm?url";
import { createResource, createRoot } from "solid-js";
import {
  Account,
  FinancialEntity,
  FinancialTransaction,
  TransactionMethod,
  TransactionSubType,
  TransactionType,
} from "./sql";

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
};

const initTables = (db: Database) => {
  FinancialEntity.initTable(db);
  Account.initTable(db);
  TransactionMethod.initTable(db);
  TransactionType.initTable(db);
  TransactionSubType.initTable(db);
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

const createLocalDB = () => {
  const [database] = createResource(mountDB);

  return { database };
};

export default createRoot(createLocalDB);
