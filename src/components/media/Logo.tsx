import { useTranslation } from "react-i18next";

import { MonoImage } from "./MonoImage";

// The site logo. `sm` renders a compact header-size mark; the default
// is the big hero art.
export function Logo({ className, size = "hero" }: { className?: string; size?: "sm" | "hero" }) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-block ${size === "sm" ? "" : "px-6 py-5 sm:px-10 sm:py-7"} ${className ?? ""}`}
    >
      <MonoImage
        src="/assets/logotext.svg"
        alt={t("a11y.logo_alt")}
        width={535}
        height={339}
        className={size === "sm" ? "w-20 md:w-24" : "w-[min(70vw,480px)]"}
      />
    </span>
  );
}
