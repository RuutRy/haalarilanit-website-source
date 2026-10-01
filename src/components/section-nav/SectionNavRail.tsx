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

// Desktop TOC rail from 72rem, where the trigger hands over. The right edge
// is one continuous clamp: 1.5rem off the text column, sliding out to 1.5rem
// off the sheet's edge once the wallpaper fits the 20rem rail - no
// thresholds, so resizing never snaps. Labels ride an em font knob (scale
// instead of truncate; long headers wrap). Portaled to body so the sheet's
// fade mask can't paint over it.
//
// Wrapper = positioning context: % there resolves against the layout
// viewport (no 100vw scrollbar overhang); the nav is the container knob.
export function SectionNavRail({ items, visible, onText, onJump }: SectionNavRailProps) {
  const { t } = useTranslation();

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-1/2 z-40 hidden -translate-y-1/2 min-[72rem]:block">
      <nav
        aria-label={t("a11y.toc")}
        className={cn(
          "@container ml-auto",
          // slide-out: 0 at the width cap (91rem), 10rem at the full-rail fit (111rem)
          "mr-[calc((100%+51rem)/2+clamp(0rem,(100%-91rem)/2,10rem))] w-[min(20rem,calc((100%-51rem)/2))]",
          "rounded-xl bg-(--panel-tint) p-2 shadow-lg backdrop-blur-lg transition-[opacity,translate] duration-300",
          // pointer-events-auto: the wrapper strip is inert, the visible rail
          // must take the pointer (hover + click) - without it the sheet
          // under it wins every hit test
          onText
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-3 opacity-0",
        )}
      >
        {/* cqw needs a descendant: the container can't size its own font. */}
        <ul className="flex max-h-[70vh] flex-col items-stretch gap-1 overflow-y-auto py-1 text-[clamp(0.75rem,7.14cqw,1rem)]">
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
      </nav>
    </div>,
    document.body,
  );
}
