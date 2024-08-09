import { Accessor, createSignal, Setter } from "solid-js";
import { JSX } from "solid-js/h/jsx-runtime";
import { Button } from "./ui/button";
import { Dialog } from "@kobalte/core/dialog";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { TextField, TextFieldInput, TextFieldLabel } from "./ui/text-field";

type PasswordDialogProps = {
  isOpen: Accessor<boolean>;
  onDialogOpenChange: () => void;
  passwordSetter: Setter<string | undefined>;
};

export const PasswordDialog = (props: PasswordDialogProps) => {
  const [password, setPassword] = createSignal<string>();

  const handleInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (
    e
  ) => {
    setPassword(e.currentTarget.value);
  };

  const handleSubmitClick: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (
    e
  ) => {
    e.preventDefault();
    props.passwordSetter(password());
    props.onDialogOpenChange();
    setPassword("");
  };

  return (
    <Dialog open={props.isOpen()} onOpenChange={props.onDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document uploaded is password protected</DialogTitle>
        </DialogHeader>
        <form
          class="flex flex-row mt-1 items-center space-x-2 w-full"
          onSubmit={handleSubmitClick}
        >
          <TextField>
            <TextFieldLabel>Enter Password:</TextFieldLabel>
            <TextFieldInput type="password" onInput={handleInputChange} />
          </TextField>
          <Button class="self-end" type="submit" disabled={!password()}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
