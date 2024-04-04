import initSqlJs from "sql.js";

import sqlJsWasmUrl from "/sql-wasm.wasm?url";

const ofpsHandler = async () => {
  const ofpsRoot = await navigator.storage.getDirectory();
  const fileHandle = await ofpsRoot.getFileHandle("sql-test.db");
  return await fileHandle.getFile();
};

export const sqlJsHandler = async () => {
  let SQL;
  try {
    SQL = await initSqlJs({ locateFile: () => sqlJsWasmUrl });
    const data = await ofpsHandler();
    const r = new FileReader();
    // const blob = new Blob([data], { type: "application/octet-stream" });
    r.readAsArrayBuffer(data);
    r.onload = () => {
      console.log(r.result);
    };
    const db = new SQL.Database();

    let sqlstr =
      "CREATE TABLE hello (a int, b char); \
INSERT INTO hello VALUES (0, 'hello'); \
INSERT INTO hello VALUES (1, 'world');";
    db.run(sqlstr);

    const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");
    const result = stmt.getAsObject({ ":aval": 1, ":bval": "world" });
    stmt.free();
    console.log(result);

    const res = db.exec("SELECT * FROM hello");
    console.log(res);

    const binaryArray = db.export();
    console.log(binaryArray);

    // const blob = new Blob([binaryArray], { type: "application/octet-stream" });

    // const ofpsRoot = await navigator.storage.getDirectory();
    // const fileHandle = await ofpsRoot.getFileHandle("sql-test.db", {
    //   create: true,
    // });
    // const writableStream = await fileHandle.createWritable();
    // await writableStream.write(blob);
    // await writableStream.close();
  } catch (error) {
    console.log(error);
  }
  return SQL;
};
