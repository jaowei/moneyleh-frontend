import * as pdfjsLib from "pdfjs-dist";
import { createSignal } from "solid-js";

import { Toaster } from "solid-toast";
import { PasswordDialog } from "./components/PasswordDialog";
import { LandingHeader } from "./views/landing/LandingHeader";
import { LandingContent } from "./views/landing/LandingContent";
import { LandingFooter } from "./views/landing/LandingFooter";
import { LandingDemo } from "./views/landing/LandingDemo";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

type AppProps = {
  worker: Worker;
};

function App(_props: AppProps) {
  let demoRef: HTMLElement | undefined;
  const [filePassword, setFilePassword] = createSignal<string>();
  const [passwordDialogIsOpen, setPasswordDialogIsOpen] = createSignal(false);

  const handleScroll = () => {
    demoRef?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <Toaster position="bottom-right" />
      <PasswordDialog
        passwordDialogTrigger={passwordDialogIsOpen}
        passwordDialogTriggerSetter={setPasswordDialogIsOpen}
        passwordSetter={setFilePassword}
      />
      <LandingHeader />
      <LandingContent clickHandler={handleScroll} />
      <LandingDemo
        ref={demoRef}
        filePassword={filePassword}
        setFilePassword={setFilePassword}
        setPasswordDialogIsOpen={setPasswordDialogIsOpen}
      />
      <LandingFooter />
    </main>
  );
}

export default App;
