import { SqlValue } from "sql.js";
import { DatabaseModel } from "../../../types";
import { databaseSeeder } from "../utils";

export type TransactionSubTypesModel = {
  id: string;
  createdAt: string;
  name: string;
  transactionTypeId: string;
};

export const TransactionSubTypes = {
  termlife: "Term Life",
  wholelife: "Whole Life",
  accident: "Accident",
  health: "Health",
  public: "Public",
  taxi: "Taxi",
  rideHailing: "Ride Hailing",
  petrol: "Petrol",
  parking: "Parking",
  clothes: "Clothes",
  electronics: "Electronics",
  appliances: "Appliances",
  gifts: "Gifts",
  restaurant: "Restaurant",
  casualDining: "Casual Dining",
  fastFood: "Fast Food",
  hawker: "Hawker",
  cafe: "Cafe",
  dessert: "Dessert",
  bbt: "BBT",
  rawFood: "Raw Food",
  dryGoods: "Dry Goods",
  cleaning: "Cleaning",
  toiletries: "Toiletries",
  gp: "GP",
  dental: "Dental",
  physio: "Physio",
  gym: "Gym",
  classes: "Classes",
  flights: "Flights",
  hotels: "Hotels",
  activities: "Activities",
  transport: "Transport",
  phonePlan: "Phone Plan",
  ntucMembership: "NTUC Membership",
  music: "Music",
} as const;

// Corresponds to the transaction types
const baseTransactionSubTypes = [
  [TransactionSubTypes.termlife, 1],
  [TransactionSubTypes.wholelife, 1],
  [TransactionSubTypes.accident, 1],
  [TransactionSubTypes.health, 1],
  [TransactionSubTypes.public, 2],
  [TransactionSubTypes.taxi, 2],
  [TransactionSubTypes.rideHailing, 2],
  [TransactionSubTypes.petrol, 2],
  [TransactionSubTypes.parking, 2],
  [TransactionSubTypes.clothes, 3],
  [TransactionSubTypes.electronics, 3],
  [TransactionSubTypes.appliances, 3],
  [TransactionSubTypes.gifts, 3],
  [TransactionSubTypes.restaurant, 4],
  [TransactionSubTypes.fastFood, 4],
  [TransactionSubTypes.hawker, 4],
  [TransactionSubTypes.cafe, 4],
  [TransactionSubTypes.dessert, 4],
  [TransactionSubTypes.bbt, 4],
  [TransactionSubTypes.rawFood, 5],
  [TransactionSubTypes.dryGoods, 5],
  [TransactionSubTypes.cleaning, 5],
  [TransactionSubTypes.toiletries, 5],
  [TransactionSubTypes.gp, 6],
  [TransactionSubTypes.dental, 6],
  [TransactionSubTypes.physio, 6],
  [TransactionSubTypes.gym, 7],
  [TransactionSubTypes.classes, 7],
  [TransactionSubTypes.flights, 8],
  [TransactionSubTypes.hotels, 8],
  [TransactionSubTypes.activities, 8],
  [TransactionSubTypes.transport, 8],
  [TransactionSubTypes.phonePlan, 17],
  [TransactionSubTypes.ntucMembership, 17],
  [TransactionSubTypes.casualDining, 8],
  [TransactionSubTypes.music, 17],
];

const TransactionSubType: DatabaseModel<TransactionSubTypesModel, SqlValue[]> =
  {
    queries: {
      createTable:
        "CREATE TABLE transactionSubType (id INTEGER PRIMARY KEY, createdAt DEFAULT CURRENT_TIMESTAMP, name char UNIQUE, transactionTypeId int, FOREIGN KEY(transactionTypeId) REFERENCES transactionType(id));",
      insertOne:
        "INSERT INTO transactionSubType(name, transactionTypeId) VALUES (?, ?)",
      selectAll: "SELECT * FROM transactionSubType;",
    },
    initTable(db) {
      db.run(this.queries.createTable);
      const stmt = db.prepare(this.queries.insertOne);
      databaseSeeder(stmt, baseTransactionSubTypes);
    },
    selectAll(db) {
      return db.exec(this.queries.selectAll)[0]?.values;
    },
  };

export { TransactionSubType };
