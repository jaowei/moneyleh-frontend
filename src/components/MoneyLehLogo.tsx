type MoneyLehLogoProps = {
  href: string;
  iconSize: string;
  textSize: string;
  isMinimised?: boolean;
};

export const MoneyLehLogo = (props: MoneyLehLogoProps) => {
  return (
    <a href={props.href} rel="noreferrer noopener" class="no-underline">
      <div class="flex items-center">
        <div
          class={`iconify ph--piggy-bank-duotone text-2xl`}
          style={{ color: "#164e63" }}
        />
        {!props.isMinimised && (
          <div class={`font-bold pl-2 text-cyan-900 text-${props.textSize}`}>
            MoneyLeh?
          </div>
        )}
      </div>
    </a>
  );
};
