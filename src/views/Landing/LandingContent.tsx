import { Component, lazy } from "solid-js";
import {
  LandingContentLogoMessage,
  FileLogo,
  BuildingLogo,
  GearLogo,
} from "../../components";

const MainLogo = lazy(() => import("../../components/MainLogo"));

export const LandingContent: Component<{ clickHandler: () => void }> = (
  props
) => {
  return (
    <section>
      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center max-w-sm 2xl:max-w-2xl 3xl:max-w-xl ">
          <div
            class="font-black pb-4"
            text=" slate-800 3xl 2xl:5xl 3xl:7xl center"
          >
            Simplify your personal finances
          </div>
          <MainLogo />
          <div text="md 2xl:lg 3xl:xl center">
            Simple tool that converts bank, credit card statements and more into
            a standardised format!
          </div>
        </div>
        <div class="grid grid-cols-3 gap-24" p="t-10">
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
              message="Coming soon, skip the spreadsheet and manage from the browser. Offline first, local only data to ensure privacy"
            />
          </div>
        </div>
        <button
          class="mt-6 mb-10 rounded-xl h-3.5rem hover:bg-cyan-800 shadow"
          border="none"
          bg="cyan-900"
          text="white lg"
          font="sans bold"
          cursor="pointer"
          animate="bounce"
          p="x-10"
          onClick={() => props.clickHandler()}
        >
          Try it out
        </button>
      </div>
    </section>
  );
};
