import { TraversableProps, TraverseButtons } from "./TraverseButtons";

interface SaveProps extends TraversableProps {}

export const Save = (props: SaveProps) => {
  return (
    <div>
      Preview transactions and Save
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
