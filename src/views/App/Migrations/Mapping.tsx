import { For } from "solid-js";
import { TraversableProps, TraverseButtons } from "./TraverseButtons";

interface MappingProps extends TraversableProps {
  sheetNames: string[];
}

export const Mapping = (props: MappingProps) => {
  return (
    <div class="grid grid-cols-1 grid-rows-[1fr_max-content] p-6 h-screen">
      <div>
        <For each={props.sheetNames}>{(name) => <div>{name}</div>}</For>
      </div>
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
