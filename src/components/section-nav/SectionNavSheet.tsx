import { useTranslation } from "react-i18next";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  onJump: (id: string) => void;
};

// Mobile quick-jump panel (edge-swipe opens it). Selecting an entry
// jumps AND closes - replacing the radix SheetClose wrapper with an
// explicit onOpenChange(false); rendered DOM is identical.
export function SectionNavSheet({
  items,
  visible,
  side,
  open,
  onOpenChange,
  onJump,
}: SectionNavSheetProps) {
  const { t } = useTranslation();

  const jumpAndClose = (id: string) => {
    onJump(id);
    onOpenChange(false);
  };

  return (
    <Sheet modal={false} open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "my-auto max-h-[75dvh] w-64 overflow-y-auto rounded-xl border border-foreground/10 bg-background p-2 text-foreground",
          side === "left"
            ? "data-[side=left]:left-4 data-[side=left]:h-fit data-[side=left]:w-64"
            : "data-[side=right]:right-4 data-[side=right]:h-fit data-[side=right]:w-64",
        )}
      >
        <SheetHeader>
          <SheetTitle>{t("a11y.toc")}</SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col gap-1 px-3 pb-3">
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
