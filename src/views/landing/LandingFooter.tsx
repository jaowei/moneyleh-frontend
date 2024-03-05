export const LandingFooter = () => {
  return (
    <footer class="flex w-full h-16" bg="cyan-900">
      <div class="flex flex-row items-center" p="x-6">
        <a
          href="https://github.com/jaowei/moneyleh-frontend"
          target="_blank"
          rel="noreferrer noopener"
        >
          <div class="i-fa6-brands:github w-2em h-2em bg-white" />
        </a>
        <div class="flex flex-row items-center" p="l-6">
          <p text="white">Made in</p>
          <div class="i-flag:sg-4x3 w-1em h-1em" p="l-6" />
        </div>
        <a
          href="https://storyset.com/insurance"
          class="no-underline text-white"
          p="l-6"
        >
          Illustrations by Storyset
        </a>
      </div>
    </footer>
  );
};
