import { ParentComponent } from "solid-js";

export const LandingFormSection: ParentComponent = ({ children }) => {
  return (
    <div class="flex flex-row items-center w-full justify-evenly" p="y-6">
      {children}
    </div>
  );
};
