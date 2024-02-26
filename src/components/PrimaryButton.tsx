import { JSX, ParentComponent, mergeProps } from "solid-js";

interface PrimaryButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) => void;
  disabled?: boolean;
}

export const PrimaryButton: ParentComponent<PrimaryButtonProps> = (props) => {
  const mergedProps = mergeProps(
    {
      text: "white sm",
      p: "y-1 x-2",
    },
    props
  );
  return (
    <button
      class={`rounded font-sans ${mergedProps.disabled ? "" : "hover:bg-cyan-700"}`}
      border="~ solid black"
      onClick={(e) => mergedProps?.onClick?.(e)}
      disabled={mergedProps?.disabled}
      bg={mergedProps?.disabled ? "gray-500" : "cyan-900"}
      cursor={mergedProps?.disabled ? "not-allowed" : "pointer"}
      text={mergedProps.text}
      p={mergedProps.p}
    >
      {props?.children}
    </button>
  );
};
