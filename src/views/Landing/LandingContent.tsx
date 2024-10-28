import {
  LandingContentLogoMessage,
  FileLogo,
  BuildingLogo,
  GearLogo,
} from "../../components";
import { Button } from "~/components/ui/button";

export const LandingContent = () => {
  return (
    <section class="flex flex-col px-4">
      <div class="flex flex-col items-center">
        <div class="font-black pb-4 text-slate-800 text-lg xl:text-2xl">
          Simplify your personal finances
        </div>
        <div class="text-sm xl:text-lg text-center">
          Simple tool that converts bank, credit card statements and more into a
          standardised format!
        </div>
      </div>
      <div class="grid grid-cols-1 grid-rows-4 items-center justify-items-center gap-6 pt-6">
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
        <Button variant="special" size="lg">
          <a href="/app/data-entry">Try it out</a>
        </Button>
      </div>
    </section>
  );
};
