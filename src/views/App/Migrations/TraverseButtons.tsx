import { Button } from "~/components/ui/button";

export interface TraversableProps {
  onContinue: () => void;
  onBack: () => void;
}

export const TraverseButtons = (props: TraversableProps) => {
  return (
    <div class="flex flex-row gap-6 justify-end">
      <Button variant="destructive" onClick={() => props.onBack()}>
        Back
      </Button>
      <Button onClick={() => props.onContinue()}>Continue</Button>
    </div>
  );
};
