import { useTranslation } from "react-i18next";

import { MonoImage } from "./MonoImage";

export function Logo({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <span className={`bg-panel inline-block px-6 py-5 sm:px-10 sm:py-7 ${className ?? ""}`}>
      <MonoImage
        src="/assets/logotext.svg"
        alt={t("a11y.logo_alt")}
        width={535}
        height={339}
        className="w-[min(70vw,480px)]"
      />
    </span>
  );
}
