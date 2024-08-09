import { MoneyLehLogo } from "../../components";

export const LandingHeader = () => {
  return (
    <header class="pb-4">
      <div class="flex justify-between py-2 px-4">
        <MoneyLehLogo href="" textSize="2xl" iconSize="2rem" />
        <a href="mailto: jaowei.8@gmail.com">
          <span class="iconify radix-icons--envelope-closed text-2xl fill-red" />
        </a>
      </div>
    </header>
  );
};
