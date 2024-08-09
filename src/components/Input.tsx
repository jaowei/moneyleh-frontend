import { Component, JSX } from "solid-js";

export const Input: Component<JSX.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      class="w-full rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-500 box-border text-sm text-slate-5 ring-1 ring-slate-900/10 py-2 px-3 border-none"
      {...props}
    />
  );
};
