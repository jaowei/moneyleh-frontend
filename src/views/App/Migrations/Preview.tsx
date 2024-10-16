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
import { createEffect, createSignal, For } from "solid-js";

interface PreviewProps extends TraversableProps {
  colMap: ColumnMap;
  sheetData: any[][];
  onPreview: (data: DataToSave) => void;
}

export const Preview = (props: PreviewProps) => {
  const [accountEntities, setAccountEntities] = createSignal<[any, any][]>();
  const [tags, setTags] = createSignal<any[]>();

  // Process accounts & entities
  createEffect(() => {
    const accountIdx = props.colMap.account.selectedColIdx;
    const entityIdx = props.colMap.entity.selectedColIdx;
    if (accountIdx?.length && entityIdx?.length) {
      let accountEntityMap = new Map();
      let entityNameMap = new Map();
      for (let data of props.sheetData) {
        const accountName = data[accountIdx[0]];
        const entityName = data[entityIdx[0]];
        entityNameMap.set(entityName, undefined);
        accountEntityMap.set(accountName, entityName);
      }
      setAccountEntities(Array.from(accountEntityMap));
      props.onPreview({
        accountEntityMap,
        entityNameMap,
      });
    }
  });

  // Process tags
  createEffect(() => {
    const tagIdx = props.colMap.tag.selectedColIdx;
    if (tagIdx?.length) {
      let tagsSet = new Set();
      props.sheetData.forEach((data) => {
        tagsSet.add(data[tagIdx[0]]);
      });
      setTags(Array.from(tagsSet));
      props.onPreview({ tagsSet });
    }
  });

  return (
    <div class="h-screen grid grid-cols-2 grid-rows-[1fr_max-content] gap-4 p-6">
      <div class="overflow-auto border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Accounts</TableHead>
              <TableHead>Entities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <For each={accountEntities() ?? []}>
              {(accountEntity) => (
                <TableRow>
                  <TableCell>{accountEntity[0]}</TableCell>
                  <TableCell>{accountEntity[1]}</TableCell>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </div>
      <div class="overflow-auto border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <For each={tags() ?? []}>
              {(tag) => (
                <TableRow>
                  <TableCell>{tag}</TableCell>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </div>
      <div class="col-span-2">
        <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
      </div>
    </div>
  );
};
