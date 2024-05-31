import { ParentComponent } from "solid-js";

interface FormFieldProps {
  formLabel?: string;
  formMessage?: string;
}

export const FormField: ParentComponent<FormFieldProps> = (props) => {
  return (
    <div class="flex flex-col gap-2 items-center self-start">
      {props?.formLabel ? (
        <label class="text-xs text-gray-6 font-700 self-start">
          {props.formLabel || ""}
        </label>
      ) : (
        <div class="h-4" />
      )}
      {props.children}
      <span class="text-xs text-red-5">{props.formMessage}</span>
    </div>
  );
};
