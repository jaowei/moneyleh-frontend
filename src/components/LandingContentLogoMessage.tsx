import { JSX } from "solid-js";

type LandingContentLogoMessageProps = {
  icon: JSX.Element;
  message: string;
};

export const LandingContentLogoMessage = (
  props: LandingContentLogoMessageProps
) => {
  return (
    <div class="flex flex-col items-center max-w-sm">
      {props.icon}
      <div class="font-medium text-center">{props.message}</div>
    </div>
  );
};
