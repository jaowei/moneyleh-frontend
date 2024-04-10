import { Database } from "sql.js";

export type DatabaseModel = {
  queries: {
    createTable: string;
    insertOne: string;
    selectAll: string;
  };
  initTable: (db: Database) => void;
  insertOne?: (db: Database, data: {}) => void;
  selectAll?: (db: Database) => {};
};
