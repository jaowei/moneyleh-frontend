export const LandingFooter = () => {
  return (
    <footer class="col-span-3 bg-cyan-900 flex flex-row items-center justify-between gap-4 px-4 py-2">
      <div class="flex flex-row items-center">
        <div class="text-white text-lg">Made in</div>
        <span class="iconify-color flag--sg-4x3 w-[32px] h-[32px] ml-2" />
      </div>
      <div class="flex flex-row gap-4">
        <a
          href="https://github.com/jaowei/moneyleh-frontend"
          target="_blank"
          rel="noreferrer noopener"
        >
          <div class="flex items-center h-full">
            <div class="iconify fa6-brands--github w-[32px] h-[32px] bg-white" />
          </div>
        </a>
        <a href="mailto: jaowei.8@gmail.com">
          <div class="flex items-center h-full">
            <div class="iconify radix-icons--envelope-closed h-[32px] w-[32px] bg-white" />
          </div>
        </a>
      </div>
    </footer>
  );
};
