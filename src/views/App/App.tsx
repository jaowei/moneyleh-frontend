import { Nav } from "./Nav";
import { createSignal, Match, ParentComponent, Switch } from "solid-js";

const App: ParentComponent = (props) => {
  const [navMinimised, setNavMinimised] = createSignal(false);
  return (
    <main class="flex bg-slate-100 h-full">
      <div class={`sticky top-0 h-screen ${navMinimised() ? "w-14" : "w-48"}`}>
        <div
          class={`h-full flex flex-col ${navMinimised() ? "items-center" : "items-end"}`}
        >
          <Nav isMinimised={navMinimised()} />
          <div
            class={`flex flex-1 items-end pb-2 ${navMinimised() ? "" : "pr-4"}`}
          >
            <button
              class="p-1 bg-none rounded-xl border-none hover:bg-gray-2"
              onClick={() => {
                setNavMinimised((prev) => !prev);
              }}
            >
              <Switch>
                <Match when={navMinimised()}>
                  <span
                    class="icon-[radix-icons--double-arrow-right]"
                    style={{ width: "1.2rem", height: "1.2rem" }}
                  />
                </Match>
                <Match when={!navMinimised()}>
                  <span
                    class="icon-[radix-icons--double-arrow-left]"
                    style={{ width: "1.2rem", height: "1.2rem" }}
                  />
                </Match>
              </Switch>
            </button>
          </div>
        </div>
      </div>
      <div class="w-full bg-gray-50 overflow-x-auto">{props.children}</div>
    </main>
  );
};

export default App;
