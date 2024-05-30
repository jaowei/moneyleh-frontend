import { Nav } from "./Nav";
import { ParentComponent } from "solid-js";

const App: ParentComponent = (props) => {
  return (
    <main class="flex bg-slate-100 h-full">
      <div class="w-56 sticky top-0 h-screen">
        <Nav />
      </div>
      <div class="w-full bg-gray-50 overflow-x-auto">{props.children}</div>
    </main>
  );
};

export default App;
