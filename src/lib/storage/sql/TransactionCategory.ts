import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";

export type TransactionCategoryModel = {
  id: string;
  createdAt: string;
  name: string;
};

export type TransactionSubCategoryModel = {
  id: string;
  createdAt: string;
  name: string;
  transactionCategoryId: string;
};

const baseTransactionCategories = [
  "Insurance",
  "Transportation",
  "Shopping",
  "Dining",
  "Groceries",
  "Healthcare",
  "Fitness",
  "Travel",
];

// Corresponds to the 8 base categories above
const baseTransactionSubCategories = [
  ["Term Life", 1],
  ["Whole Life", 1],
  ["Accident", 1],
  ["Health", 1],
  ["Public", 2],
  ["Taxi", 2],
  ["Ride Hailing", 2],
  ["Petrol", 2],
  ["Parking", 2],
  ["Clothes", 3],
  ["Electronics", 3],
  ["Appliances", 3],
  ["Gifts", 3],
  ["Restaurant", 4],
  ["Fast Food", 4],
  ["Hawker", 4],
  ["Cafe", 4],
  ["Dessert", 4],
  ["BBT", 4],
  ["Food", 5],
  ["Dry Goods", 5],
  ["Cleaning", 5],
  ["Toiletries", 5],
  ["GP", 6],
  ["Dental", 6],
  ["Physio", 6],
  ["Gym", 7],
  ["Classes", 7],
  ["Flights", 8],
  ["Hotels", 8],
  ["Activities", 8],
  ["Transport", 8],
  ["Meals", 8],
];

const TransactionCategory: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE transactionCategory(id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char);",
    insertOne: "INSERT INTO transactionCategory(name) VALUES (?)",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionCategories);
  },
};

const TransactionSubCategory: DatabaseModel = {
  queries: {
    createTable:
      "CREATE TABLE transactionSubCategory (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char, transactionCategoryId int, FOREIGN KEY(transactionCategoryId) REFERENCES transactionCategory(id));",
    insertOne:
      "INSERT INTO transactionSubCategory(name, transactionCategoryId) VALUES (?, ?)",
    selectAll: "",
  },
  initTable(db) {
    db.run(this.queries.createTable);
    const stmt = db.prepare(this.queries.insertOne);
    databaseSeeder(stmt, baseTransactionSubCategories);
  },
};

export { TransactionCategory, TransactionSubCategory };
