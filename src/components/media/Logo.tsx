import type { ComponentProps } from "react";

import { useTranslation } from "react-i18next";

import { MonoImage } from "./MonoImage";

// `sm` is the compact header mark; default is the hero art. Rest props
// pass through - the main page tags its hero logo with data-hero-logo
// so the header can time its own mark to the hero's exit.
export function Logo({
  className,
  size = "hero",
  ...rest
}: { className?: string; size?: "sm" | "hero" } & ComponentProps<"span">) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-block ${size === "sm" ? "" : "px-6 py-[1em] sm:px-10"} ${className ?? ""}`}
      {...rest}
    >
      <MonoImage
        src="/assets/logotext.svg"
        alt={t("a11y.logo_alt")}
        width={535}
        height={339}
        className={size === "sm" ? "w-20 md:w-24" : "h-[13em] w-auto"}
      />
    </span>
  );
}
