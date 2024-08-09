import { SortDirection } from "@tanstack/solid-table";
import { Switch, Match } from "solid-js";

export interface ColumnSortProps {
  sortDirection: false | SortDirection;
  onSort?: () => ((e: unknown) => void) | undefined;
}

export const ColumnSort = (props: ColumnSortProps) => {
  return (
    <div class="cursor-pointer" onClick={(e) => props.onSort?.()?.(e)}>
      <Switch fallback={<div class="i-radix-icons:caret-sort w-1em h-1em" />}>
        <Match when={props.sortDirection === "asc"}>
          <div class="i-radix-icons:caret-up w-1em h-1em" />
        </Match>
        <Match when={props.sortDirection === "desc"}>
          <div class="i-radix-icons:caret-down w-1em h-1em" />
        </Match>
      </Switch>
    </div>
  );
};
