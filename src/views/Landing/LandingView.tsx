import { lazy } from "solid-js";
import { LandingContent } from "./LandingContent";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";

const DemoView = lazy(() => import("./LandingDemo"));

const LandingView = () => {
  let demoRef: HTMLElement | undefined;

  const handleScroll = () => {
    demoRef?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <main>
      <LandingHeader />
      <LandingContent clickHandler={handleScroll} />
      <DemoView ref={demoRef} />
      <LandingFooter />
    </main>
  );
};

export default LandingView;
