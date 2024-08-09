import { Component, lazy } from "solid-js";
import {
  LandingContentLogoMessage,
  FileLogo,
  BuildingLogo,
  GearLogo,
} from "../../components";
import { Button } from "~/components/ui/button";

const MainLogo = lazy(() => import("../../components/MainLogo"));

export const LandingContent: Component<{ clickHandler: () => void }> = (
  props
) => {
  return (
    <section>
      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center max-w-sm 2xl:max-w-2xl 3xl:max-w-xl ">
          <div class="font-black pb-4 text-slate-800 text-3xl center">
            Simplify your personal finances
          </div>
          <MainLogo />
          <div class="text-md 2xl:text-lg 3xl:text-xl text-center">
            Simple tool that converts bank, credit card statements and more into
            a standardised format!
          </div>
        </div>
        <div class="grid grid-cols-3 gap-24 pt-10">
          <div>
            <LandingContentLogoMessage
              icon={<FileLogo />}
              message="Supports .csv .pdf .xls & .xlsx"
            />
          </div>
          <div>
            <LandingContentLogoMessage
              icon={<BuildingLogo />}
              message="Statement formats for Singaporean accounts available"
            />
          </div>
          <div>
            <LandingContentLogoMessage
              icon={<GearLogo />}
              message="Ready to skip the spreadsheet? Try the offline first, local only app"
            />
          </div>
        </div>
        <div class="mt-10">
          <Button onClick={() => props.clickHandler()}>Try it out</Button>
        </div>
      </div>
    </section>
  );
};
