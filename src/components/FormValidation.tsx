import { SetStoreFunction } from "solid-js/store";

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
