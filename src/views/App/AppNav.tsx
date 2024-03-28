import { ParentComponent } from "solid-js";
import { MoneyLehLogo } from "../../components";

const NavItem: ParentComponent<{ href: string }> = (props) => {
  return (
    <a href={props.href} class="no-underline">
      <div class="flex items-center gap-2" text="cyan-900 lg" font="400">
        {props.children}
      </div>
    </a>
  );
};

export const AppNav = () => {
  return (
    <div class="flex flex-col gap-10 px-4">
      <div class="pt-6">
        <MoneyLehLogo href="/" textSize="xl" iconSize="2rem" />
      </div>
      <nav class="flex flex-col gap-8">
        <NavItem href="dashboard">
          <div
            class="i-radix-icons:bar-chart w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          Dashboard
        </NavItem>
        <NavItem href="accounts">
          <div
            class="i-radix-icons:avatar w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          Accounts
        </NavItem>
        <NavItem href="transactions">
          <div
            class="i-radix-icons:table w-1.2rem h-1.2rem"
            style={{ color: "#164e63" }}
          />
          Transactions
        </NavItem>
      </nav>
    </div>
  );
};
