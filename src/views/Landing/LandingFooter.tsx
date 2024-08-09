export const LandingFooter = () => {
  return (
    <footer class="flex w-full h-16 bg-cyan-9">
      <div class="flex flex-row items-center px-6">
        <a
          href="https://github.com/jaowei/moneyleh-frontend"
          target="_blank"
          rel="noreferrer noopener"
        >
          <div class="i-fa6-brands:github w-2em h-2em bg-white" />
        </a>
        <div class="flex flex-row items-center pl-6">
          <p class="text-white">Made in</p>
          <div class="i-flag:sg-4x3 w-1em h-1em pl-6" />
        </div>
        <a
          href="https://storyset.com/insurance"
          class="no-underline text-white pl-6"
        >
          Illustrations by Storyset
        </a>
      </div>
    </footer>
  );
};
