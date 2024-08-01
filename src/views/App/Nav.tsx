import { ParentComponent, createEffect, createSignal } from "solid-js";
import { MoneyLehLogo } from "../../components";
import { useLocation } from "@solidjs/router";

interface NavItemProps {
  href: string;
  isSelected: boolean;
  isMinimised: boolean;
}

const NavItem: ParentComponent<NavItemProps> = (props) => {
  return (
    <a href={props.href} class="no-underline">
      <div
        class={`flex items-center gap-2 rounded-lg`}
        text="cyan-900 lg"
        font="400"
        bg={props.isSelected ? "slate-3" : "none"}
        p={!props.isMinimised ? "y-2 x-4" : "x-1 y-1"}
      >
        {props.children}
      </div>
    </a>
  );
};

interface NavProps {
  isMinimised: boolean;
}

const navContainerStyles = (isMinimised: boolean) =>
  isMinimised ? "px-2 items-center" : "px-6";

export const Nav = (props: NavProps) => {
  const [currentTab, setCurrentTab] = createSignal();
  const location = useLocation();
  createEffect(() => {
    const tabName = location.pathname.split("/").at(-1);
    setCurrentTab(tabName);
  });
  return (
    <div
      class={`flex flex-col gap-10 h-full ${navContainerStyles(props.isMinimised)}`}
    >
      <div class="pt-6">
        <MoneyLehLogo
          href="/"
          textSize="xl"
          iconSize="2rem"
          isMinimised={props.isMinimised}
        />
      </div>
      <nav class="flex flex-col gap-6">
        <NavItem
          href="dashboard"
          isSelected={currentTab() === "dashboard"}
          isMinimised={props.isMinimised}
        >
          <div
            class="i-radix-icons:bar-chart w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          {!props.isMinimised && "Dashboard"}
        </NavItem>
        <NavItem
          href="accounts"
          isSelected={currentTab() === "accounts"}
          isMinimised={props.isMinimised}
        >
          <div
            class="i-radix-icons:avatar w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />

          {!props.isMinimised && "Accounts"}
        </NavItem>
        <NavItem
          href="transactions"
          isSelected={currentTab() === "transactions"}
          isMinimised={props.isMinimised}
        >
          <div
            class="i-radix-icons:table w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          {!props.isMinimised && "Transactions"}
        </NavItem>
        <NavItem
          href="data-entry"
          isSelected={currentTab() === "data-entry"}
          isMinimised={props.isMinimised}
        >
          <div
            class="i-radix-icons:upload w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />

          {!props.isMinimised && "Data Entry"}
        </NavItem>
      </nav>
    </div>
  );
};
