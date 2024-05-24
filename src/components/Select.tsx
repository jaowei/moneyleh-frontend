import { Component, JSX } from "solid-js";

export const Select: Component<JSX.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => {
  return (
    <select
      class="text-sm w-full py-2 px-3 ring-1 ring-slate-900/10 text-slate-500 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-500"
      border="none"
      {...props}
    >
      {props.children}
    </select>
  );
};
