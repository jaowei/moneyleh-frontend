import { lazy } from "solid-js";
import { LandingContent } from "./LandingContent";
import { LandingFooter } from "./LandingFooter";

const DemoView = lazy(() => import("./LandingDemo"));

const LandingView = () => {
  return (
    <main class="grid grid-cols-3 grid-rows-[1fr_max-content] h-screen">
      <div class="flex flex-col pt-4 items-center">
        <header class="">
          <div class="flex justify-between py-2 px-4">
            <a href="" rel="noreferrer noopener" class="no-underline">
              <div class="flex items-center">
                <div
                  class="iconify ph--piggy-bank-duotone h-[48px] w-[48px]"
                  style={{ color: "#164e63" }}
                />
                <div class="font-bold pl-2 text-cyan-900 text-4xl xl:text-6xl">
                  MoneyLeh?
                </div>
              </div>
            </a>
          </div>
        </header>
        <LandingContent />
      </div>
      <DemoView />
      <LandingFooter />
    </main>
  );
};

export default LandingView;
