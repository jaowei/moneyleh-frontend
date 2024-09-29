import { TraversableProps, TraverseButtons } from "./TraverseButtons";

interface PreviewProps extends TraversableProps {}

export const Preview = (props: PreviewProps) => {
  return (
    <div>
      Preview
      <TraverseButtons onBack={props.onBack} onContinue={props.onContinue} />
    </div>
  );
};
