import { ParentComponent, createEffect, createSignal } from "solid-js";
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
        class={`flex items-center gap-2 rounded-lg text-cyan-900 text-lg font-400 px-[8px] py-[4px] ${props.isSelected ? "bg-gray-200" : "bg-none"} ${!props.isMinimised ? "y-2 x-2" : "x-1 y-1"}`}
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
  isMinimised ? "px-2 items-center" : "px-2";

export const Nav = (props: NavProps) => {
  const [currentTab, setCurrentTab] = createSignal();
  const location = useLocation();
  createEffect(() => {
    const tabName = location.pathname.split("/").at(-1);
    setCurrentTab(tabName);
  });
  return (
    <div
      class={`flex flex-col gap-10 h-full w-full ${navContainerStyles(props.isMinimised)}`}
    >
      <div class="pt-6">
        <a href="/" rel="noreferrer noopener" class="no-underline">
          <div class="flex items-center">
            <div
              class="iconify ph--piggy-bank-duotone h-[24px] w-[24px]"
              style={{ color: "#164e63" }}
            />
            {!props.isMinimised && (
              <div class="font-bold pl-2 text-cyan-900 text-lg">MoneyLeh?</div>
            )}
          </div>
        </a>
      </div>
      <nav class="flex flex-col gap-6">
        <NavItem
          href="dashboard"
          isSelected={currentTab() === "dashboard"}
          isMinimised={props.isMinimised}
        >
          <div
            class="iconify radix-icons--bar-chart"
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
            class="iconify radix-icons--avatar"
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
            class="iconify radix-icons--table"
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
            class="iconify radix-icons--upload"
            style={{ color: "#164e63" }}
          />

          {!props.isMinimised && "Data Entry"}
        </NavItem>
        <NavItem
          href="migrations"
          isSelected={currentTab() === "migrations"}
          isMinimised={props.isMinimised}
        >
          <div class="iconify radix-icons--loop" style={{ color: "#164e63" }} />

          {!props.isMinimised && "Migrations"}
        </NavItem>
      </nav>
    </div>
  );
};
