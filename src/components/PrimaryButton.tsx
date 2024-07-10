import { JSX, ParentComponent, splitProps } from "solid-js";

export const PrimaryButton: ParentComponent<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  const [buttonState, rest] = splitProps(props, ["disabled"]);
  return (
    <button
      class={`inline-flex items-center justify-center rounded-md font-sans w-full max-w-36 h-10 ${buttonState.disabled ? "" : "hover:shadow-md"}`}
      border="~ solid black"
      text="white sm"
      font="medium"
      p="y-2 x-5"
      disabled={buttonState?.disabled}
      bg={buttonState?.disabled ? "gray-600" : "cyan-900"}
      cursor={buttonState?.disabled ? "not-allowed" : "pointer"}
      {...rest}
    >
      {props?.children}
    </button>
  );
};
