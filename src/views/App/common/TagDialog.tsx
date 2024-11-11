import initDB from "../../../lib/storage/sqljs";
import { createEffect, createSignal, JSX } from "solid-js";
import { TransactionTag } from "~/lib/storage/sql/TransactionTags";
import toast from "solid-toast";
import { DialogWrapperProps } from "~/types/Dialog";
import { ManagerDialog } from "~/components/ManagerDialog";

interface TagDialogProps extends DialogWrapperProps {}

export const TagDialog = (props: TagDialogProps) => {
  const { database, staticInfo, refetch } = initDB;

  const [newTagName, setNewTagName] = createSignal<string>();
  const [tagsList, setTagsList] = createSignal<string[]>();
  const [selectedTag, setSelectedTag] = createSignal<string>();
  const [selectedTagIdx, setSelectedTagIdx] = createSignal<number>();

  createEffect(() => {
    const tagsList = [];
    for (const tag of staticInfo.transactionTags) {
      tagsList.push(tag[0]);
    }
    setTagsList(tagsList);
  });

  const handleItemClick = (currIdx: number, currItemName: string) => {
    const isSameIdx = selectedTagIdx() === currIdx;
    setSelectedTag(isSameIdx ? undefined : currItemName);
    setSelectedTagIdx((prev) => {
      if (prev === currIdx) {
        return undefined;
      }
      return currIdx;
    });
  };

  const handleUpdateChange = (value: string) => {
    setSelectedTag(value);
  };

  const handleCreateChange = (value: string) => {
    setNewTagName(value);
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
    <ManagerDialog
      isOpen={props.isOpen}
      onDialogOpenChange={props.onDialogOpenChange}
      title="Tag Manager"
      desc="Update and create tags here"
      existing={tagsList() ?? []}
      selectedItem={selectedTag}
      itemToCreate={newTagName}
      selectedItemIdx={selectedTagIdx}
      onItemClick={handleItemClick}
      onUpdateSubmit={handleTagUpdateSubmit}
      onCreateSubmit={handleTagCreationSubmit}
      onCreateChange={handleCreateChange}
      onUpdateChange={handleUpdateChange}
    />
  );
};
