import initSqlJs, { Database } from "sql.js";

import sqlJsWasmUrl from "/sql-wasm.wasm?url";
import { createResource, createRoot } from "solid-js";
import { initFETable } from "./sql/FinancialEntity";

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

const mountDB = async () => {
  try {
    const SQL = await initSqlJs({ locateFile: () => sqlJsWasmUrl });
    const data = await initialiseOpfsFile();
    if (!data.size) {
      console.log("Initialising DB");
      const emptyDB = new SQL.Database();
      initFETable(emptyDB);
      const res = emptyDB.exec("SELECT * FROM financialEntity");
      console.log(res);
      await persistDB(emptyDB);
      return emptyDB;
    } else {
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
