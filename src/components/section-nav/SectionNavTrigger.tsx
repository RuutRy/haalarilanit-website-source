import { List } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

// Quick-jump handle below 2xl (the rail owns desktop), sticky at the sheet's
// end like BackToTop so it docks above the footer. The h-0 wrapper takes no
// layout slot; the negative margins cancel main's padding.
export function SectionNavTrigger({
  open,
  onText,
  onToggle,
}: {
  open: boolean;
  onText: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const show = onText && !open;

  return (
    // no-reveal: keep the section-reveal animation from overriding the visibility transitions.
    <div className="no-reveal sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 h-0 w-full -mb-8 -ml-8 self-stretch sm:-ml-12 2xl:hidden">
      <button
        type="button"
        aria-label={t("a11y.toc")}
        aria-expanded={open}
        tabIndex={show ? 0 : -1}
        onClick={onToggle}
        className={cn(
          "pointer-events-auto absolute bottom-0 left-0 flex h-9 w-6 items-center justify-center rounded-r-full border border-l-0 border-foreground/10 bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all duration-300",
          "hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          show ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0",
        )}
      >
        <List className="size-4 text-foreground/70" />
      </button>
    </div>
  );
}
