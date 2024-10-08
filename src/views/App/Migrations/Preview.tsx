import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ColumnMapInfo } from "./Migrations";
import { TraversableProps, TraverseButtons } from "./TraverseButtons";
import { createEffect, createSignal, For } from "solid-js";

interface PreviewProps extends TraversableProps {
  colMap: ColumnMapInfo[];
  sheetData: any[][];
}

export const Preview = (props: PreviewProps) => {
  const [accountEntities, setAccountEntities] = createSignal<[any, any][]>();
  const [tags, setTags] = createSignal<any[]>();
  // Process accounts & entities
  createEffect(() => {
    const accountIdx = props.colMap[4].selectedColIdx;
    const entityIdx = props.colMap[5].selectedColIdx;
    if (accountIdx?.length && entityIdx?.length) {
      let accountEntityMap = new Map();
      props.sheetData.forEach((data) => {
        const accountName = data[accountIdx[0]];
        const entityName = data[entityIdx[0]];
        accountEntityMap.set(accountName, entityName);
      });
      console.log(accountEntityMap);
      setAccountEntities(Array.from(accountEntityMap));
    }
  });

  // Process tags
  createEffect(() => {
    const tagIdx = props.colMap[6].selectedColIdx;
    if (tagIdx?.length) {
      let tagSet = new Set();
      props.sheetData.forEach((data) => {
        tagSet.add(data[tagIdx[0]]);
      });
      console.log("TAGS======", tagSet);
      setTags(Array.from(tagSet));
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
