/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import "virtual:uno.css";

import { Router, Route } from "@solidjs/router";
import { Toaster } from "solid-toast";
import { lazy } from "solid-js";
import { ComingSoon, NotFound } from "./components";
import { DataEntry } from "./views/App";

const root = document.getElementById("root");

const Landing = lazy(() => import("./views/Landing/LandingView"));
const App = lazy(() => import("./views/App/App"));

render(
  () => (
    <>
      <Router>
        <Route path="/" component={Landing} />
        <Route path="/app" component={App}>
          <Route path="/dashboard" component={ComingSoon} />
          <Route path="/accounts" component={ComingSoon} />
          <Route path="/data-entry" component={DataEntry} />
          <Route path="/transactions" component={ComingSoon} />
        </Route>
        <Route path="*404" component={NotFound} />
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
