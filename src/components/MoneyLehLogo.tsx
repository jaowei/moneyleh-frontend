type MoneyLehLogoProps = {
  href: string;
  iconSize: string;
  textSize: string;
};

export const MoneyLehLogo = (props: MoneyLehLogoProps) => {
  return (
    <a href={props.href} rel="noreferrer noopener" class="no-underline">
      <div class="flex items-center">
        <div
          class={`i-ph:piggy-bank-duotone w-${props.iconSize} h-${props.iconSize}`}
          style={{ color: "#164e63" }}
        />
        <div class="font-bold pl-2" text={`cyan-900 ${props.textSize}`}>
          MoneyLeh?
        </div>
      </div>
    </a>
  );
};
