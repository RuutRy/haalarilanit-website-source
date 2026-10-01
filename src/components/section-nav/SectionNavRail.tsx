import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { SectionNavItem } from "./SectionNavItem";
import type { SectionNavItemData } from "./useSectionSpy";

type SectionNavRailProps = {
  items: SectionNavItemData[];
  visible: Set<string>;
  onText: boolean;
  onJump: (item: SectionNavItemData) => void;
};

// Hung off the sheet's left edge (2xl+), shown only while the article
// text is on screen. Portaled to body so the sheet's top fade mask
// never paints over it.
export function SectionNavRail({ items, visible, onText, onJump }: SectionNavRailProps) {
  const { t } = useTranslation();

  return createPortal(
    <nav
      aria-label={t("a11y.toc")}
      className={cn(
        "fixed top-1/2 z-40 hidden w-56 -translate-y-1/2 transition-all duration-300 2xl:block",
        "left-[calc(max((100vw-72rem)/2+2rem,2rem)-14.5rem)]" /* sheet half-width (24rem) + gap, floor 2rem */,
        "rounded-xl border border-foreground/10 bg-background p-2 shadow-lg",
        onText ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0",
      )}
    >
      <ul className="flex max-h-[70vh] flex-col items-stretch gap-1 overflow-y-auto py-1">
        {items.map((item) => (
          <SectionNavItem
            key={item.id}
            item={item}
            active={visible.has(item.id)}
            variant="rail"
            onJump={onJump}
          />
        ))}
      </ul>
    </nav>,
    document.body,
  );
}
