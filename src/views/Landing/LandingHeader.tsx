import { MoneyLehLogo } from "../../components";

export const LandingHeader = () => {
  return (
    <header class="pb-4">
      <div class="flex justify-between" p="y-2 x-4">
        <MoneyLehLogo href="" textSize="2xl" iconSize="2rem" />
        <a href="mailto: jaowei.8@gmail.com">
          <div
            class="i-radix-icons:envelope-closed w-2rem h-2rem"
            style={{ color: "#164e63" }}
          />
        </a>
      </div>
    </header>
  );
};
