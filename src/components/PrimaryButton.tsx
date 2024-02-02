import { ParentComponent, splitProps } from "solid-js";

export const PrimaryButton: ParentComponent = (props) => {
  const [nonAttributes, others] = splitProps(props, ["children"]);
  return <button {...others}>{nonAttributes.children}</button>;
};
