import { Component, JSX } from "solid-js";

export const Select: Component<JSX.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => {
  return (
    <select
      class="w-full rounded-lg shadow-sm h-9 leading-5 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-500"
      text="sm slate-5"
      ring="1 slate-900/10"
      p="y-2 x-3"
      border="none"
      {...props}
    >
      {props.children}
    </select>
  );
};
