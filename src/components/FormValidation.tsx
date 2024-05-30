import { JSX } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";

interface ValidationConfig {
  element: HTMLInputElement | HTMLFormElement;
  validators: any[];
}

export function checkValid(
  blurEvent: FocusEvent & { target: HTMLInputElement | HTMLSelectElement },
  validators: any[] = [],
  setErrors: SetStoreFunction<{ [k: string]: any }>
) {
  const validationTarget = blurEvent.target.value;
  for (const validator of validators) {
    const text = validator({ value: validationTarget });
    if (text) {
      setErrors(blurEvent.target.name, text);
    } else {
      setErrors(blurEvent.target.name, "");
    }
  }
}

// export const useForm = ({ errorClass }: { errorClass: string }) => {
//   const [errors, setErrors] = createStore<Record<string, any>>({}),
//     fields: Record<string, any> = {};

//   const validate = (
//     ref: HTMLInputElement | HTMLFormElement,
//     accessor: () => any
//   ) => {
//     console.log(ref, accessor);
//     const accessorValue = accessor();
//     const validators = Array.isArray(accessorValue) ? accessorValue : [];
//     let config;
//     fields[ref.name] = config = { element: ref, validators };
//     ref.onblur = checkValid(config, setErrors, errorClass);
//     ref.oninput = () => {
//       if (!errors[ref.name]) return;
//       setErrors({ [ref.name]: undefined });
//       errorClass && ref.classList.toggle(errorClass, false);
//     };
//   };

//   const formSubmit = (
//     ref: HTMLInputElement | HTMLFormElement,
//     accessor: () => any
//   ) => {
//     const callback = accessor() || (() => {});
//     ref.setAttribute("novalidate", "");
//     ref.onsubmit = async (e) => {
//       e.preventDefault();
//       let errored = false;

//       for (const k in fields) {
//         const field = fields[k];
//         await checkValid(field, setErrors, errorClass)();
//         if (!errored && field.element.validationMessage) {
//           field.element.focus();
//           errored = true;
//         }
//       }
//       !errored && callback(ref);
//     };
//   };

//   return { validate, formSubmit, errors };
// };
