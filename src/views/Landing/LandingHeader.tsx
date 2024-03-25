export const LandingHeader = () => {
  return (
    <header class="pb-4">
      <div class="flex justify-between" p="y-2 x-4">
        <a href="" rel="noreferrer noopener" class="no-underline">
          <div class="flex items-center">
            <div
              class="i-ph:piggy-bank-duotone w-2rem h-2rem"
              style={{ color: "#164e63" }}
            />
            <div class="font-bold pl-2" text="cyan-900 2xl">
              MoneyLeh?
            </div>
          </div>
        </a>
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
