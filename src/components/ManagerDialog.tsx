import { Accessor, createEffect, createSignal, For, JSX, Show } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { TextFieldLabel, TextFieldInput, TextField } from "./ui/text-field";
import { DialogWrapperProps } from "~/types/Dialog";
import { Button } from "./ui/button";

interface ManagerDialogProps extends DialogWrapperProps {
  title: string;
  desc: string;
  existing: string[];
  selectedItem: Accessor<string | undefined>;
  itemToCreate: Accessor<string | undefined>;
  selectedItemIdx: Accessor<number | undefined>;
  onItemClick: (currIdx: number, currName: string) => void;
  onUpdateSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
  onCreateSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
  onUpdateChange: (value: string) => void;
  onCreateChange: (value: string) => void;
}

export const ManagerDialog = (props: ManagerDialogProps) => {
  const [isUpdateDisabled, setIsUpdateDisabled] = createSignal<boolean>(true);

  createEffect(() => {
    const currentIdx = props.selectedItemIdx();
    const currentName = props.selectedItem();
    if (currentName && currentIdx !== undefined && props.existing) {
      setIsUpdateDisabled(currentName === props.existing[currentIdx]);
    }
  });

  return (
    <Dialog open={props.isOpen()} onOpenChange={props.onDialogOpenChange}>
      <DialogContent class="max-w-4xl h-[30rem]">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.desc}</DialogDescription>
        </DialogHeader>
        <div class="grid grid-cols-2 grid-rows-1 gap-4 h-80">
          <div>
            Select to update an existing, deselect to create
            <div class="flex flex-col gap-2 p-2 border rounded-xl overflow-auto h-full">
              <For each={props.existing}>
                {(name, idx) => (
                  <div
                    class={`${props.selectedItemIdx() === idx() ? "bg-gray-100" : ""}`}
                    onClick={() => {
                      props.onItemClick(idx(), name);
                    }}
                  >
                    {name}
                  </div>
                )}
              </For>
            </div>
          </div>
          <Show
            when={props.selectedItem() === undefined}
            fallback={
              <form class="flex flex-col gap-6" onSubmit={props.onUpdateSubmit}>
                <TextField
                  value={props.selectedItem()}
                  onChange={props.onUpdateChange}
                >
                  <TextFieldLabel>Update existing tag:</TextFieldLabel>
                  <TextFieldInput type="text" />
                </TextField>
                <Button type="submit" disabled={isUpdateDisabled()}>
                  Save
                </Button>
              </form>
            }
          >
            <form
              class="flex flex-col gap-6"
              onSubmit={(e) => props.onCreateSubmit(e)}
            >
              <TextField
                value={props.itemToCreate()}
                onChange={props.onCreateChange}
              >
                <TextFieldLabel>Create a tag:</TextFieldLabel>
                <TextFieldInput type="text" />
              </TextField>
              <Button type="submit" disabled={!props.itemToCreate()}>
                Save
              </Button>
            </form>
          </Show>
        </div>
      </DialogContent>
    </Dialog>
  );
};
