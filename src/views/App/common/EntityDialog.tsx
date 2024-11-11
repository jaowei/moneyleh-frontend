import { DialogWrapperProps } from "~/types/Dialog";
import initDB from "../../../lib/storage/sqljs";
import { createEffect, createSignal, JSX } from "solid-js";
import { FinancialEntity } from "~/lib/storage";
import toast from "solid-toast";
import { ManagerDialog } from "~/components/ManagerDialog";

interface EntityDialogProps extends DialogWrapperProps {}

export const EntityDialog = (props: EntityDialogProps) => {
  const { database, staticInfo, refetch } = initDB;
  const [entityNames, setEntityNames] = createSignal<string[]>();
  const [selectedEntity, setSelectedEntity] = createSignal<string>();
  const [selectedEntityIdx, setSelectedEntityIdx] = createSignal<number>();
  const [newEntityName, setNewEntityName] = createSignal<string>();

  createEffect(() => {
    const entityNames = [];
    for (const entity of staticInfo.entities) {
      entityNames.push(entity[0]);
    }
    setEntityNames(entityNames);
  });

  const handleUpdateChange = (value: string) => {
    setSelectedEntity(value);
  };

  const handleCreateChange = (value: string) => {
    setNewEntityName(value);
  };

  const handleItemClick = (currIdx: number, currItemName: string) => {
    const isSameIdx = selectedEntityIdx() === currIdx;
    setSelectedEntity(isSameIdx ? undefined : currItemName);
    setSelectedEntityIdx((prev) => {
      if (prev === currIdx) {
        return undefined;
      }
      return currIdx;
    });
  };

  const handleEntityCreationSubmit: JSX.EventHandler<
    HTMLFormElement,
    SubmitEvent
  > = async (e) => {
    try {
      e.preventDefault();
      const db = database();
      const name = newEntityName();
      if (db && name) {
        await FinancialEntity.insertOne(db, name);
        refetch();
      }
      toast.success(`New entity: ${name} created!`);
      setNewEntityName();
    } catch (error) {
      toast.error(
        `Entity with name: ${newEntityName()} already created, try with another name`
      );
    }
  };

  const handleEntityUpdateSubmit: JSX.EventHandler<
    HTMLFormElement,
    SubmitEvent
  > = async (e) => {
    try {
      e.preventDefault();
      const names = entityNames();
      const idx = selectedEntityIdx();
      const oldName = names && idx !== undefined ? names[idx] : undefined;
      const db = database();
      const newName = selectedEntity();
      const id = oldName && staticInfo.entities.get(oldName)?.id;
      if (db && newName && id) {
        await FinancialEntity.updateOne(db, {
          $name: newName,
          $id: id,
        });
        refetch();
      }
      toast.success(`Updated entity: ${oldName} to ${newName}!`);
      setSelectedEntity();
      setSelectedEntityIdx();
    } catch (error) {
      toast.error("Error updating entity name!");
    }
  };

  return (
    <ManagerDialog
      isOpen={props.isOpen}
      onDialogOpenChange={props.onDialogOpenChange}
      title="Entity/Company Manager"
      desc="Update and create financial entities here"
      existing={entityNames() ?? []}
      selectedItem={selectedEntity}
      itemToCreate={newEntityName}
      selectedItemIdx={selectedEntityIdx}
      onItemClick={handleItemClick}
      onUpdateSubmit={handleEntityUpdateSubmit}
      onCreateSubmit={handleEntityCreationSubmit}
      onCreateChange={handleCreateChange}
      onUpdateChange={handleUpdateChange}
    />
  );
};
