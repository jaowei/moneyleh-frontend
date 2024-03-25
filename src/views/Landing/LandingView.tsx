import { createSignal, lazy } from "solid-js";
import { PasswordDialog } from "../../components/PasswordDialog";
import { LandingContent } from "./LandingContent";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";

const DemoView = lazy(() => import("./LandingDemo"));

const LandingView = () => {
  let demoRef: HTMLElement | undefined;
  const [filePassword, setFilePassword] = createSignal<string>();
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);

  const handleScroll = () => {
    demoRef?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <main>
      <LandingHeader />
      <LandingContent clickHandler={handleScroll} />
      <DemoView
        ref={demoRef}
        filePassword={filePassword}
        setFilePassword={setFilePassword}
        setPasswordDialogIsOpen={setPasswordDialogIsOpen}
      />
      <LandingFooter />
      <PasswordDialog
        passwordDialogTrigger={passwordDialogIsOpen}
        passwordDialogTriggerSetter={setPasswordDialogIsOpen}
        passwordSetter={setFilePassword}
      />
    </main>
  );
};

export default LandingView;
