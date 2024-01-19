import { JSX } from "solid-js";

interface LandingFormSectionTextProps {
  primaryText: string;
  secondaryText?: string;
  children?: JSX.Element;
}

export const LandingFormSectionText = ({
  primaryText,
  secondaryText,
  children,
}: LandingFormSectionTextProps) => (
  <div class="w-full min-w-min max-w-xs">
    <p text="cyan-900 xl" font="extrabold" m="0">
      {primaryText}
    </p>
    {secondaryText && (
      <p text="sm gray-700" m="0">
        {secondaryText}
      </p>
    )}
    {children}
  </div>
);
