import { AppNav } from "./AppNav";
import { ParentComponent } from "solid-js";

const App: ParentComponent = (props) => {
  return (
    <main class="flex">
      <aside class="w-56">
        <div class="h-screen bg-slate-100">
          <AppNav />
        </div>
      </aside>
      <section class="w-full">
        <div class="flex justify-center items-center h-screen">
          {props.children}
        </div>
      </section>
    </main>
  );
};

export default App;
