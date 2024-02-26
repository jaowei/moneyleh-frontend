import { Accessor, createEffect, createSignal, Setter, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { PrimaryButton } from ".";
import { JSX } from "solid-js/h/jsx-runtime";

type PasswordDialogProps = {
  passwordDialogTrigger: Accessor<boolean>;
  passwordDialogTriggerSetter: Setter<boolean>;
  passwordSetter: Setter<string | undefined>;
};

export const PasswordDialog = (props: PasswordDialogProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [password, setPassword] = createSignal<string>();

  createEffect(() => {
    setIsOpen(props.passwordDialogTrigger());
  });

  const handleCloseButtonClick = () => {
    setIsOpen(false);
    props.passwordDialogTriggerSetter(false);
  };

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
    props.passwordDialogTriggerSetter(false);
    setPassword("");
  };

  return (
    <Show when={isOpen()}>
      <Portal>
        <div class="fixed top-0 h-screen w-screen flex justify-center items-center bg-gray-600/50 z-10">
          <div class="relative h-1/3 sm:h-1/4 flex justify-center flex-col items-center max-w-3xl sm:m-10 m-4 sm:p-20 p-5 rounded-lg bg-white">
            <h3>Document uploaded is password protected</h3>
            <form
              class="flex flex-row mt-1 items-center space-x-2"
              onSubmit={handleSubmitClick}
            >
              <label for="password">Enter Password:</label>
              <input
                id="password"
                type="password"
                required
                onInput={handleInputChange}
              />
              <PrimaryButton type="submit" disabled={!password()}>
                Submit
              </PrimaryButton>
            </form>
            <button
              class="absolute top-5 right-3 hover:text-gray-300"
              border="none"
              bg="transparent"
              cursor="pointer"
              onClick={handleCloseButtonClick}
            >
              <div class="i-radix-icons:cross-2  w-2.5em h-2.5em" />
            </button>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
