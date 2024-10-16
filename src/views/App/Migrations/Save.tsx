import { DataToSave } from "./Migrations";
import { TraversableProps, TraverseButtons } from "./TraverseButtons";

interface SaveProps extends TraversableProps {
  dataToSave: DataToSave;
}

export const Save = (props: SaveProps) => {
  return (
    <div>
      Preview transactions and Save
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
