import { ParentComponent } from "solid-js";
import { Button } from "~/components/ui/button";

export interface TraversableProps {
  onContinue: () => void;
  onBack: () => void;
}

export const Footer: ParentComponent = (props) => (
  <div class="flex flex-row gap-6 justify-end">{props.children}</div>
);

export const BackButton = (props: { onBack: () => void }) => (
  <Button variant="destructive" onClick={() => props.onBack()}>
    Back
  </Button>
);

export const ContinueButton = (props: { onContinue: () => void }) => (
  <Button onClick={() => props.onContinue()}>Continue</Button>
);

export const TraverseButtons = (props: TraversableProps) => {
  return (
    <Footer>
      <BackButton onBack={props.onBack} />
      <ContinueButton onContinue={props.onContinue} />
    </Footer>
  );
};
