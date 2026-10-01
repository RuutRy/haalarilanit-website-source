import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SectionNavItemData } from "./useSectionSpy";

type SectionNavItemProps = {
  item: SectionNavItemData;
  active: boolean;
  variant: "rail" | "sheet";
  onJump: (id: string) => void;
};

// Rail items: a leading chevron marks the sections on screen (slides
// in, standard TOC affordance) - text bolds and nudges inward slightly.
// The sheet variant differs only in radius, hover, font sizes, and
// dimmed colors (documented against the pre-split markup).
export function SectionNavItem({ item, active, variant, onJump }: SectionNavItemProps) {
  const chevronClass = cn(
    "size-3.5 text-primary",
    variant === "sheet" && "transition-all duration-300",
    active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
  );
  const buttonClass = cn(
    "w-full truncate py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    variant === "rail"
      ? "rounded-md hover:text-foreground"
      : "rounded-lg text-sm hover:bg-foreground/10",
    active
      ? variant === "rail"
        ? "pl-1 text-base font-semibold text-foreground"
        : "font-semibold text-foreground"
      : variant === "rail"
        ? "pl-1 text-sm font-normal text-foreground/50"
        : "font-normal text-foreground/70",
  );

  return (
    <li className="flex items-center gap-0.5">
      <span aria-hidden className="flex w-3.5 shrink-0 justify-center">
        <ChevronRight className={chevronClass} />
      </span>
      <button
        type="button"
        onClick={() => onJump(item.id)}
        aria-current={active ? "true" : undefined}
        className={buttonClass}
      >
        {item.label}
      </button>
    </li>
  );
}
