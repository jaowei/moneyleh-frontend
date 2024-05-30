import { Component, JSX } from "solid-js";

export const Input: Component<JSX.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      class="w-full rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-300 focus:border-blue-500"
      box="border"
      text="sm slate-5"
      ring="1 slate-900/10"
      p="y-2 x-3"
      border="none"
      {...props}
    />
  );
};
