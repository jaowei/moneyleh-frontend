import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import initDB from "../../../lib/storage/sqljs";
import { Button } from "~/components/ui/button";
import { Accessor, createEffect, createSignal, For, JSX, Show } from "solid-js";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { TransactionTag } from "~/lib/storage/sql/TransactionTags";
import toast from "solid-toast";

interface TagDialogProps {
  isOpen: Accessor<boolean>;
  onDialogOpenChange: (isOpen: boolean) => void;
}

export const TagDialog = (props: TagDialogProps) => {
  const { database, staticInfo, refetch } = initDB;

  const [newTagName, setNewTagName] = createSignal<string>();
  const [tagsList, setTagsList] = createSignal<string[]>();
  const [selectedTag, setSelectedTag] = createSignal<string>();
  const [selectedTagIdx, setSelectedTagIdx] = createSignal<number>();
  const [isUpdateDisabled, setIsUpdateDisabled] = createSignal<boolean>(true);

  createEffect(() => {
    const tagsList = [];
    for (const tag of staticInfo.transactionTags) {
      tagsList.push(tag[0]);
    }
    setTagsList(tagsList);
  });

  createEffect(() => {
    const tag = selectedTag();
    const tagIdx = selectedTagIdx();
    const tagList = tagsList();
    if (tag && tagIdx !== undefined && tagList) {
      setIsUpdateDisabled(tag === tagList[tagIdx]);
    }
  });

  const handleTagInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
    e
  ) => {
    setNewTagName(e.currentTarget.value);
  };
  const handleTagCreationSubmit: JSX.EventHandler<
    HTMLFormElement,
    SubmitEvent
  > = async (e) => {
    try {
      e.preventDefault();
      const db = database();
      const name = newTagName();
      if (db && name) {
        await TransactionTag.insertOne(db, name);
        refetch();
      }
      toast.success(`New tag: ${name} created!`);
      setNewTagName();
    } catch (error) {
      toast.error(
        `Tag with name: ${newTagName()} already created, try with another name`
      );
    }
  };

  const handleTagUpdateSubmit: JSX.EventHandler<
    HTMLFormElement,
    SubmitEvent
  > = async (e) => {
    try {
      e.preventDefault();
      const tagList = tagsList();
      const idx = selectedTagIdx();
      const oldName = tagList && idx !== undefined ? tagList[idx] : undefined;
      const db = database();
      const newName = selectedTag();
      const id = oldName && staticInfo.transactionTags.get(oldName)?.id;
      if (db && newName && id) {
        await TransactionTag.updateOne(db, {
          $name: newName,
          $id: id,
        });
        refetch();
      }
      toast.success(`Updated tag: ${oldName} to ${newName}!`);
      setSelectedTag();
      setSelectedTagIdx();
    } catch (error) {
      toast.error("Error updating tag name!");
    }
  };

  return (
    <Dialog open={props.isOpen()} onOpenChange={props.onDialogOpenChange}>
      <DialogContent class="max-w-4xl h-[30rem]">
        <DialogHeader>
          <DialogTitle>Tags Manager</DialogTitle>
          <DialogDescription>Create or update your tags</DialogDescription>
        </DialogHeader>
        <div class="grid grid-cols-2 grid-rows-1 gap-4 h-80">
          <div>
            Select to update an existing tag
            <div class="flex flex-col gap-2 p-2 border rounded-xl overflow-auto h-full">
              <For each={tagsList()}>
                {(tag, idx) => (
                  <div
                    class={`${selectedTagIdx() === idx() ? "bg-gray-100" : ""}`}
                    onClick={() => {
                      const isSameIdx = selectedTagIdx() === idx();
                      setSelectedTag(isSameIdx ? undefined : tag);
                      setSelectedTagIdx((prev) => {
                        if (prev === idx()) {
                          return undefined;
                        }
                        return idx();
                      });
                    }}
                  >
                    {tag}
                  </div>
                )}
              </For>
            </div>
          </div>
          <Show
            when={!selectedTag()}
            fallback={
              <form
                class="flex flex-col gap-6"
                onSubmit={handleTagUpdateSubmit}
              >
                <TextField value={selectedTag()} onChange={setSelectedTag}>
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
              onSubmit={handleTagCreationSubmit}
            >
              <TextField>
                <TextFieldLabel>Create a tag:</TextFieldLabel>
                <TextFieldInput type="text" onInput={handleTagInput} />
              </TextField>
              <Button type="submit" disabled={!newTagName()}>
                Save
              </Button>
            </form>
          </Show>
        </div>
      </DialogContent>
    </Dialog>
  );
};
