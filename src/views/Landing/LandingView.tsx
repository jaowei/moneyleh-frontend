import * as pdfjsLib from "pdfjs-dist";

import { createSignal } from "solid-js";
import { PasswordDialog } from "../../components/PasswordDialog";
import { LandingContent } from "./LandingContent";
import { LandingDemo } from "./LandingDemo";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export const LandingView = () => {
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
      <LandingDemo
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
