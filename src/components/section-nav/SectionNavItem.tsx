import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SectionNavItemData } from "./useSectionSpy";

type SectionNavItemProps = {
  item: SectionNavItemData;
  active: boolean;
  variant: "rail" | "sheet";
  onJump: (item: SectionNavItemData) => void;
};

// Tree depth indents the row 0.75rem per level (0.75em on the rail, so the
// indent scales with its font knob); page title leftmost. Rail rows keep one
// size and weight whatever their state: the centered list must not reflow
// when the scrollspy activates a row (a 1em active row re-wrapped long
// headers and shifted the whole rail on every section change). State reads
// through color + chevron + a layout-inert scale; hover through a fading wash.
export function SectionNavItem({ item, active, variant, onJump }: SectionNavItemProps) {
  const rail = variant === "rail";
  const buttonClass = cn(
    "flex w-full items-center py-1 text-left leading-snug focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    rail
      ? // hover wash, never the active text color: a row must not look
        // scrollspy-active while hovering (and an un-transitioned 50%->100%
        // text swap strobed on every cursor crossing - the "hover flash").
        // px insets the text from the bubble edges, uniform per state so the
        // text can't shift when hover/selection changes.
        "rounded-md px-[0.5em] py-[0.25em] text-[0.875em] font-normal transition-colors duration-150 hover:bg-foreground/10"
      : "rounded-lg px-[0.5em] text-sm transition-colors duration-150 hover:bg-foreground/10",
    active
      ? rail
        ? "text-foreground"
        : "font-semibold text-foreground"
      : rail
        ? "text-foreground/50"
        : "font-normal text-foreground/70",
  );

  return (
    <li
      className={cn("flex items-center", rail ? "gap-[0.125em]" : "gap-0.5")}
      style={{ paddingInlineStart: `${item.depth * 0.75}${rail ? "em" : "rem"}` }}
    >
      <span
        aria-hidden
        className={cn("flex shrink-0 justify-center", rail ? "w-[0.875em]" : "w-3.5")}
      >
        {/* Chevrons mark the sections in view - spy data, never the click. */}
        <ChevronRight
          className={cn(
            rail ? "size-[0.875em]" : "size-3.5",
            "text-primary transition-[opacity,translate] duration-150",
            active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
          )}
        />
      </span>
      <button
        type="button"
        onClick={() => onJump(item)}
        aria-current={active ? "true" : undefined}
        className={buttonClass}
      >
        {rail ? (
          // Selected = scale, not font-size: transforms don't touch layout,
          // so the box (and any wrap) stays identical in both states - the
          // centered list can't pop when the scrollspy or hover changes.
          <span
            className={cn(
              "inline-block origin-left transition-transform duration-150",
              active && "scale-[1.08]",
            )}
          >
            {item.label}
          </span>
        ) : (
          item.label
        )}
      </button>
    </li>
  );
}
