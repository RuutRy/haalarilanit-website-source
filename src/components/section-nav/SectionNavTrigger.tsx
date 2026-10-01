import { List } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

// Mobile quick-jump indicator: the edge-swipe is invisible, so the sheet
// gets a slim handle hugging the left viewport edge. IN FLOW, sticky like
// BackToTop (same bottom offset; the remark plugin injects it at the
// sheet's end): over the article it rides the viewport's bottom-left, at
// the page end it docks above the footer instead of floating over it - the
// sticky containing block is the sheet, never the footer. The h-0 wrapper
// occupies no layout slot and -mb-8 trims its share of the sheet's flex
// gap; the handle paints above the wrapper line. The negative left margins
// cancel main's px-4/sm:px-8 + the sheet's 1rem padding; self-stretch keeps
// the negative-margin box full-width within the sheet's column layout.
// 2xl:hidden - the rail owns desktop.
//
// Dynamics: opening the sheet retracts the handle under the edge (fade +
// slide) and closing returns it along the same transition. No extra hint
// animation on first show - the plain slide-in reads calm; a wiggle after
// the pop-in just read as glitchy. aria-expanded tracks the sheet; the
// handle leaves the tab order while hidden or retracted.
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
    // no-reveal keeps the section-reveal view() animation from overriding
    // the handle's visibility transitions (it targets direct sheet children).
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
