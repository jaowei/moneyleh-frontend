import { Nav } from "./Nav";
import { createSignal, Match, ParentComponent, Switch } from "solid-js";

const App: ParentComponent = (props) => {
  const [navMinimised, setNavMinimised] = createSignal(false);
  return (
    <main class="flex h-screen w-screen">
      <div
        class={`sticky top-0 h-screen ${navMinimised() ? "w-[5%] xl:w-[4%] 2xl:w-[3%]" : "w-[16%] 2xl:w-[11%] 3xl:w-[9%]"} bg-gray-100`}
      >
        <div
          class={`h-full flex flex-col ${navMinimised() ? "items-center" : "items-end"}`}
        >
          <Nav isMinimised={navMinimised()} />
          <div
            class={`flex flex-1 items-end pb-2 ${navMinimised() ? "" : "pr-4"}`}
          >
            <button
              class="flex items-center p-2 bg-none rounded-full border-none hover:bg-gray-200"
              onClick={() => {
                setNavMinimised((prev) => !prev);
              }}
            >
              <Switch>
                <Match when={navMinimised()}>
                  <span
                    class="iconify radix-icons--double-arrow-right"
                    style={{ width: "1.2rem", height: "1.2rem" }}
                  />
                </Match>
                <Match when={!navMinimised()}>
                  <span
                    class="iconify radix-icons--double-arrow-left"
                    style={{ width: "1.2rem", height: "1.2rem" }}
                  />
                </Match>
              </Switch>
            </button>
          </div>
        </div>
      </div>
      <div
        class={`${navMinimised() ? "w-[95%] xl:w-[96%] 2xl:w-[97%]" : "w-[84%] 2xl:w-[89%] 3xl:w-[91%]"}`}
      >
        {props.children}
      </div>
    </main>
  );
};

export default App;
