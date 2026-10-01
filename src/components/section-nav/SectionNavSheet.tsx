import { useTranslation } from "react-i18next";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SectionNavItem } from "./SectionNavItem";
import type { SwipeSide } from "./useEdgeSwipe";
import type { SectionNavItemData } from "./useSectionSpy";

type SectionNavSheetProps = {
  items: SectionNavItemData[];
  visible: Set<string>;
  side: SwipeSide;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJump: (item: SectionNavItemData) => void;
};

// Mobile quick-jump panel (edge-swipe opens it); selecting an entry jumps and closes.
export function SectionNavSheet({
  items,
  visible,
  side,
  open,
  onOpenChange,
  onJump,
}: SectionNavSheetProps) {
  const { t } = useTranslation();

  const jumpAndClose = (item: SectionNavItemData) => {
    onJump(item);
    onOpenChange(false);
  };

  return (
    <Sheet modal={false} open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        // aria-label keeps the dialog named without the visible title the
        // desktop rail doesn't have either (the variants stay identical).
        aria-label={t("a11y.toc")}
        className={cn(
          // Borderless frosted card; kill the primitive's side border.
          "my-auto max-h-[75dvh] w-64 overflow-y-auto rounded-xl bg-(--panel-tint) p-2 text-foreground backdrop-blur-lg data-[side=left]:border-r-0 data-[side=right]:border-l-0",
          side === "left"
            ? "data-[side=left]:left-4 data-[side=left]:h-fit data-[side=left]:w-64"
            : "data-[side=right]:right-4 data-[side=right]:h-fit data-[side=right]:w-64",
        )}
      >
        <ul className="flex flex-col gap-1 px-3 py-3">
          {items.map((item) => (
            <SectionNavItem
              key={item.id}
              item={item}
              active={visible.has(item.id)}
              variant="sheet"
              onJump={jumpAndClose}
            />
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
