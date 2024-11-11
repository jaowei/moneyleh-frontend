import { Accessor } from "solid-js";

export interface DialogWrapperProps {
  isOpen: Accessor<boolean>;
  onDialogOpenChange: (isOpen: boolean) => void;
}
