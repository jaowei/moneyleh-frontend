import { Component, ParentComponent } from "solid-js";

interface PrimaryButtonProps {
  onClick?: (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) => void;
  disabled?: boolean;
}

export const PrimaryButton: ParentComponent<PrimaryButtonProps> = (props) => {
  return (
    <button
      class={`rounded font-sans ${props.disabled ? "" : "hover:bg-cyan-700"}`}
      p="y-1 x-2"
      border="~ solid black"
      text="white sm"
      onClick={(e) => props?.onClick?.(e)}
      disabled={props?.disabled}
      bg={props?.disabled ? "gray-500" : "cyan-900"}
      cursor={props?.disabled ? "not-allowed" : "pointer"}
    >
      {props?.children}
    </button>
  );
};
