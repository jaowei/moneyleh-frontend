import { sqlJsHandler } from "../../lib/storage/sqljs";
import { AppNav } from "./AppNav";
import { ParentComponent } from "solid-js";

const App: ParentComponent = (props) => {
  sqlJsHandler();
  return (
    <main class="flex">
      <aside class="w-56">
        <div class="h-screen bg-slate-100">
          <AppNav />
        </div>
      </aside>
      <section class="w-full">{props.children}</section>
    </main>
  );
};

export default App;
