import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ColumnMap, DataToSave } from "./Migrations";
import { TraversableProps, TraverseButtons } from "./TraverseButtons";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { createMemo, For } from "solid-js";
import { genericCell } from "~/components/DataGrid/Cells";
import { formatTransactionDate } from "~/utils/dayjs";
import { Button } from "~/components/ui/button";
import initDB from "../../../lib/storage/sqljs";
import {
  Account,
  AccountTypes,
  DefaultAccountTypeIds,
  FinancialEntity,
  FinancialTransaction,
} from "~/lib/storage";
import { Database } from "sql.js";
import toast from "solid-toast";
import { TransactionTag } from "~/lib/storage/sql/TransactionTags";

interface SaveProps extends TraversableProps {
  colMap: ColumnMap;
  dataToSave: DataToSave;
  sheetData: any[][];
}

const columnHelper = createColumnHelper<any>();

const columnDefs = [
  columnHelper.accessor("transactionDate", {
    header: "Transaction Date",
    cell: genericCell,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: genericCell,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: genericCell,
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
    cell: genericCell,
  }),
  columnHelper.accessor("account", {
    header: "Account Name",
    cell: genericCell,
  }),
  columnHelper.accessor("entity", {
    header: "Entity",
    cell: genericCell,
  }),
  columnHelper.accessor("transactionTags", {
    header: "Transaction Tags",
    cell: genericCell,
  }),
];

const CellError = "Err!";

const createEntities = async (db: Database, entityNameMap: Map<any, any>) => {
  for (const entry of entityNameMap) {
    const entityId = await FinancialEntity.insertOne(db, entry[0]);
    entityNameMap.set(entry[0], entityId[0]);
  }
};

const createAccounts = async (
  db: Database,
  accountEntityMap: Map<any, any>,
  entityNameMap: Map<any, any>
) => {
  const accountIdsMap = new Map();
  for (const entry of accountEntityMap) {
    const accountId = await Account.insertOne?.(db, {
      $name: entry[0],
      $accountTypeId: DefaultAccountTypeIds[AccountTypes.cash],
      $startingBalance: 0,
      $financialEntityId: entityNameMap.get(entry[1]),
    });
    accountIdsMap.set(entry[0], accountId?.[0] ?? 1);
  }
  return accountIdsMap;
};

const createTags = async (db: Database, tagsSet: Set<any>) => {
  const tagsIdMap = new Map();
  for (const tagName of tagsSet) {
    const tagId = await TransactionTag.insertOne(db, tagName);
    tagsIdMap.set(tagName, tagId[0]);
  }
  return tagsIdMap;
};

const createTransactions = async (
  db: Database,
  accountIdMap: Map<any, any>,
  tagIdMap: Map<any, any>,
  colMap: ColumnMap,
  sheetData: any[]
) => {
  const toPersist = sheetData.map((data) => {
    const transaction = mapColsToData(colMap, data, "");
    return {
      $transactionDate: transaction.transactionDate ?? "",
      $amount: transaction.amount,
      $currency: transaction.currency,
      $description: transaction.description,
      $accountId: accountIdMap.get(transaction.account),
      $transactionTagIds: JSON.stringify([
        tagIdMap.get(transaction.transactionTags),
      ]),
    };
  });
  await FinancialTransaction.insertMany?.(db, toPersist);
};

const mapColsToData = (
  colMap: ColumnMap,
  rowData: any[],
  emptyValue = CellError
) => {
  const transactionDateColIdx = colMap.transactionDate.selectedColIdx?.[0];
  const descriptionColIdx = colMap.description.selectedColIdx;
  const amountColIdx = colMap.amount.selectedColIdx?.[0];
  const currencyColIdx = colMap.currency.selectedColIdx?.[0];
  const accountColIdx = colMap.account.selectedColIdx?.[0];
  const entityColIdx = colMap.entity.selectedColIdx?.[0];
  const tagColIdx = colMap.tag.selectedColIdx?.[0];
  const description = descriptionColIdx?.reduce((prev, curr) => {
    return prev + " " + (rowData[curr] ?? "");
  }, "");
  return {
    transactionDate:
      transactionDateColIdx !== undefined
        ? formatTransactionDate(
            new Date(rowData[transactionDateColIdx]).toLocaleDateString(),
            "DD/MM/YYYY"
          )
        : emptyValue,
    description: description ?? emptyValue,
    amount: amountColIdx ? rowData[amountColIdx] : emptyValue,
    currency: currencyColIdx ? rowData[currencyColIdx] : emptyValue,
    account: accountColIdx ? rowData[accountColIdx] : emptyValue,
    entity: entityColIdx ? rowData[entityColIdx] : emptyValue,
    transactionTags: tagColIdx ? rowData[tagColIdx] : emptyValue,
  };
};

export const Save = (props: SaveProps) => {
  const { database } = initDB;
  const transactionData = createMemo(() => {
    return props.sheetData.slice(0, 100).map((data) => {
      return mapColsToData(props.colMap, data);
    });
  });

  const handleSave = async () => {
    const db = database();
    const entityNameMap = props.dataToSave?.entityNameMap ?? new Map();
    const accountEntityMap = props.dataToSave?.accountEntityMap ?? new Map();
    const tagsSet = props.dataToSave.tagsSet ?? new Set();
    if (db) {
      try {
        await createEntities(db, entityNameMap);
        const accountIdMap = await createAccounts(
          db,
          accountEntityMap,
          entityNameMap
        );
        const tagIdMap = await createTags(db, tagsSet);
        await createTransactions(
          db,
          accountIdMap,
          tagIdMap,
          props.colMap,
          props.sheetData
        );
      } catch (error) {
        toast.error("Error saving", { position: "bottom-center" });
        console.error(error);
      }
    }
  };

  const transactionsTable = createSolidTable({
    get data() {
      return transactionData();
    },
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div class="grid grid-cols-1 grid-rows-[1fr_max-content] h-screen gap-6 p-6">
      <div class="overflow-auto border rounded-xl">
        <Table>
          <TableHeader>
            <For each={transactionsTable.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <TableHead>
                        {flexRender(
                          header.column.columnDef.header ?? "",
                          header.getContext()
                        )}
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <For each={transactionsTable.getRowModel().rows}>
              {(row) => (
                <TableRow>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <TableCell>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </div>
      <div>
        <Button onClick={handleSave}>Save</Button>
      </div>
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
