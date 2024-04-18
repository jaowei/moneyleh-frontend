import { ParentComponent, createEffect, createSignal } from "solid-js";
import { MoneyLehLogo } from "../../components";
import { useLocation } from "@solidjs/router";

const NavItem: ParentComponent<{ href: string; isSelected: boolean }> = (
  props
) => {
  return (
    <a href={props.href} class="no-underline">
      <div
        class={`flex items-center gap-2 rounded-lg`}
        text="cyan-900 lg"
        font="400"
        bg={props.isSelected ? "slate-3" : "none"}
        p="1"
      >
        {props.children}
      </div>
    </a>
  );
};

export const AppNav = () => {
  const [currentTab, setCurrentTab] = createSignal();
  const location = useLocation();
  createEffect(() => {
    const tabName = location.pathname.split("/").at(-1);
    setCurrentTab(tabName);
  });
  return (
    <div class="flex flex-col gap-10 px-4">
      <div class="pt-6">
        <MoneyLehLogo href="/" textSize="xl" iconSize="2rem" />
      </div>
      <nav class="flex flex-col gap-6">
        <NavItem href="dashboard" isSelected={currentTab() === "dashboard"}>
          <div
            class="i-radix-icons:bar-chart w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          Dashboard
        </NavItem>
        <NavItem href="accounts" isSelected={currentTab() === "accounts"}>
          <div
            class="i-radix-icons:avatar w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          Accounts
        </NavItem>
        <NavItem
          href="transactions"
          isSelected={currentTab() === "transactions"}
        >
          <div
            class="i-radix-icons:table w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          Transactions
        </NavItem>
        <NavItem href="data-entry" isSelected={currentTab() === "data-entry"}>
          <div
            class="i-radix-icons:upload w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          Data Entry
        </NavItem>
      </nav>
    </div>
  );
};
