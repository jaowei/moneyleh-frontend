import { JSX } from "solid-js";

type LandingContentLogoMessageProps = {
  icon: JSX.Element;
  message: string;
};

export const LandingContentLogoMessage = (
  props: LandingContentLogoMessageProps
) => {
  return (
    <div class="flex flex-row items-center max-w-xs">
      {props.icon}
      <div class="font-medium text-center text-sm">{props.message}</div>
    </div>
  );
};
