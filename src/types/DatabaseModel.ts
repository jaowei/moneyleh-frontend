import { Database } from "sql.js";

export type DatabaseModel<T, V = {}> = {
  queries: {
    createTable: string;
    insertOne: string;
    selectAll: string;
    [key: string]: string;
  };
  initTable: (db: Database) => void;
  insertOne?: (db: Database, data: T) => Promise<Array<any>>;
  insertMany?: (db: Database, data: Array<T>) => void;
  selectAll?: (db: Database) => V[];
};
