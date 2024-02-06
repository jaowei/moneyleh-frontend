/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import "virtual:uno.css";

import App from "./App";

const root = document.getElementById("root");

const worker = new Worker("src/lib/sqlite/sqlite-worker.ts", {
  type: "module",
});

render(() => <App worker={worker} />, root!);
