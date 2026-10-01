import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SectionNavItemData } from "./useSectionSpy";

type SectionNavItemProps = {
  item: SectionNavItemData;
  active: boolean;
  variant: "rail" | "sheet";
  onJump: (item: SectionNavItemData) => void;
};

// Tree depth indents the row 0.75rem per level (page title leftmost).
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
    <li
      className="flex items-center gap-0.5"
      style={{ paddingInlineStart: `${item.depth * 0.75}rem` }}
    >
      <span aria-hidden className="flex w-3.5 shrink-0 justify-center">
        <ChevronRight className={chevronClass} />
      </span>
      <button
        type="button"
        onClick={() => onJump(item)}
        aria-current={active ? "true" : undefined}
        className={buttonClass}
      >
        {item.label}
      </button>
    </li>
  );
}
