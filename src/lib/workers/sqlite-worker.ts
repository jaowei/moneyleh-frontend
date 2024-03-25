import sqlite3InitModule, {
  Database,
  Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";

const log = (...args: string[]) => console.log(...args);
const error = (...args: string[]) => console.error(...args);

const start = function (sqlite3: Sqlite3Static) {
  log("Running SQLite3 version", sqlite3.version.libVersion);
  let db: Database;
  if ("opfs" in sqlite3) {
    db = new sqlite3.oo1.OpfsDb("/mydb.sqlite3", "w");
    log("OPFS is available, created persisted database at", db.filename);
  } else {
    db = new sqlite3.oo1.DB("/mydb.sqlite3", "ct");
    log("OPFS is not available, created transient database", db.filename);
  }
  // Your SQLite code here.
};

onmessage = function (e) {
  console.log("Worker: Message received from main script");
  const result = e.data[0];
  console.log("WORKER THREAD: ", result);
};

log("Loading and initializing SQLite3 module...");
sqlite3InitModule({
  print: log,
  printErr: error,
}).then((sqlite3) => {
  log("Done initializing. Running demo...");
  try {
    start(sqlite3);
  } catch (err: any) {
    error(err.name, err.message);
  }
});
