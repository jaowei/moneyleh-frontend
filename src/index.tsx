/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import "virtual:uno.css";

import { Router, Route } from "@solidjs/router";
import { Toaster } from "solid-toast";
import { LandingView } from "./views/Landing/LandingView";
import { lazy } from "solid-js";

const root = document.getElementById("root");

const App = lazy(() => import("./views/App/App"));

render(
  () => (
    <>
      <Router>
        <Route path="/" component={LandingView} />
        <Route path="/app" component={App} />
      </Router>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  ),
  root!
);
