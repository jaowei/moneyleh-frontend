/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import "virtual:uno.css";

import { Router, Route } from "@solidjs/router";
import { Toaster } from "solid-toast";
import { lazy } from "solid-js";
import { NotFound } from "./components";

const root = document.getElementById("root");

const Landing = lazy(() => import("./views/Landing/LandingView"));
const App = lazy(() => import("./views/App/App"));

render(
  () => (
    <>
      <Router>
        <Route path="/" component={Landing} />
        <Route path="/app" component={App}>
          <Route path="/dashboard" component={() => <div>Dashboard</div>} />
          <Route path="/accounts" component={() => <div>Accounts</div>} />
          <Route
            path="/transactions"
            component={() => <div>Transactions</div>}
          />
        </Route>
        <Route path="/*404" component={NotFound} />
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
