import { Database } from "sql.js";

export type DatabaseModel<T> = {
  queries: {
    createTable: string;
    insertOne: string;
    selectAll: string;
  };
  initTable: (db: Database) => void;
  insertOne?: (db: Database, data: T) => Array<any>;
  insertMany?: (db: Database, data: Array<T>) => void;
  selectAll?: (db: Database) => {};
};
