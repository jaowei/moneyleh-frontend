import { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { AccountForm } from "./AccountForm";
import { createSignal } from "solid-js";
import { formInfo } from "./DataEntry";
import { SetStoreFunction } from "solid-js/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AccountSelector, AccountSelectorState } from "./AccountSelector";
import { Badge } from "~/components/ui/badge";

interface HeaderProps {
  fileName: string;
  onSaveClick: () => void;
  onCopyClick: () => void;
  onExportClick: () => void;
  isDisabled: boolean;
  formInfo: formInfo;
  setFormInfo: SetStoreFunction<formInfo>;
}

export const Header = (props: HeaderProps) => {
  const [openDialog, setOpenDialog] = createSignal<boolean>(false);
  const closeDialog = () => {
    setOpenDialog(false);
  };

  const handleAccountSelection = (state: AccountSelectorState | null) => {
    const account = state?.value;
    const label = state?.label;
    props.setFormInfo("accountId", (account?.[0] as string) ?? "");
    props.setFormInfo("type", (account?.[3] as string) ?? "");
    props.setFormInfo("name", label ?? "");
    closeDialog();
  };

  return (
    <div class="flex flex-row justify-between items-center p-2 bg-gray-100">
      <div class="flex flex-row gap-2 items-center">
        <Badge class="w-max">{props.fileName}</Badge>
        <span class="iconify radix-icons--arrow-right w-[32px]" />
        <Dialog open={openDialog()} onOpenChange={setOpenDialog}>
          <DialogTrigger
            as={(dialogProps: DialogTriggerProps) => (
              <Button class="w-full" {...dialogProps}>
                {props.formInfo.name || "Select target account"}
              </Button>
            )}
          />
          <DialogContent>
            <Tabs defaultValue="existing">
              <TabsList>
                <TabsTrigger value="existing">
                  Select existing account
                </TabsTrigger>
                <TabsTrigger value="new">Create new account</TabsTrigger>
              </TabsList>
              <TabsContent value="existing">
                <AccountSelector
                  formInfo={props.formInfo}
                  onAccountSelected={handleAccountSelection}
                />
              </TabsContent>
              <TabsContent value="new">
                <AccountForm
                  formInfo={props.formInfo}
                  setFormInfo={props.setFormInfo}
                  closeForm={closeDialog}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      <div class="flex flex-row gap-2">
        <Button onClick={props.onCopyClick} disabled={props.isDisabled}>
          Copy
        </Button>
        <Button onClick={props.onExportClick} disabled={props.isDisabled}>
          Export as CSV
        </Button>
        {/* <Button>Tags</Button> */}
        <Button
          variant="special"
          disabled={props.isDisabled}
          onClick={props.onSaveClick}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
