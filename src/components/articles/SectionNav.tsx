import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { flashHeading } from "@/lib/heading-flash";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string };

// Scroll-quiet period (ms) after which gliding/auto-scrolling counts as
// done - used to defer the hash write and mark sections settled.
const SETTLE_MS = 200;

// Resolve cb once scrolling has been quiet for SETTLE_MS: a programmatic
// glide keeps firing scroll events, so the timer only completes once the
// browser is done scrolling - and with no glide it fires on its own.
// (scrollend would be the exact signal but is not green across the
// browserslist bar - see package.json.)
function whenScrollSettled(cb: () => void): void {
  let timer = 0;
  const fire = () => {
    clearTimeout(timer);
    removeEventListener("scroll", onScroll);
    cb();
  };
  const onScroll = () => {
    clearTimeout(timer);
    timer = window.setTimeout(fire, SETTLE_MS);
  };
  addEventListener("scroll", onScroll, { passive: true });
  timer = window.setTimeout(fire, SETTLE_MS);
}

// Dock-style TOC, hung just left of the content sheet (desktop 2xl+).
// On smaller screens there is no visible trigger at all: a horizontal
// swipe starting near either screen edge opens the quick-jump as a
// floating overlay panel (from the swiped side). The mdx content is the
// single source of truth: the nav reads `.content-sheet h2[id]` after
// mount and renders nothing on the server. Portaled to body so the
// sheet's top fade mask never paints over it.
//
// Sections on screen are tracked by measuring heading positions (rAF on
// scroll): every visible section's entry is bolded, the rest stay dim -
// so the marks follow scrolling AND programmatic jumps alike. The last
// non-empty set holds over gaps between section panels.
//
// The rail only shows while the article text is on screen - hidden over
// the hero strip and past the sheet's end.
export function SectionNav() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [onText, setOnText] = useState(false);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right">("left");
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    whenScrollSettled(() => {
      history.replaceState(null, "", `#${id}`);
      flashHeading(id);
    });
    // Optimistic: the clicked section marks instantly; the scrollspy keeps
    // the rest honest while the glide passes through.
    setVisible((prev) => new Set(prev).add(id));
  };

  useEffect(() => {
    const DEEP_LINK_DELAY_MS = 400; // fonts/layout settle before the glide

    const sheet = document.querySelector(".content-sheet");
    if (!sheet) return;
    // The plugin decides anchor-worthiness (>= 2 sections). No-anchors sheets
    // hide copy-link buttons AND this nav - one rule, one owner.
    if (sheet.classList.contains("no-anchors")) return;

    // The anchor id lives on the heading's wrapper span (see Article).
    const headings = [...sheet.querySelectorAll<HTMLElement>("h2")].filter(
      (h) => h.parentElement?.id,
    );

    const found = headings.map((h) => ({ id: h.parentElement!.id, label: h.textContent ?? "" }));
    setItems(found);

    // Deep-link feedback: a URL hash names the section you arrived at -
    // jump to it and flash the heading once the auto-scroll settles.
    const initial = decodeURIComponent(location.hash.slice(1));
    if (initial && found.some((i) => i.id === initial)) {
      setTimeout(() => jump(initial), DEEP_LINK_DELAY_MS);
    }

    // Which sections are on screen: a heading counts as visible while
    // its wrapper sits between the header line and 75% of the viewport.
    // The last non-empty set holds over gaps between section panels.
    let lastNonEmpty = new Set<string>();
    let raf = 0;
    const measure = () => {
      raf = 0;
      const next = new Set<string>();
      for (const h of headings) {
        const rect = h.parentElement!.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 96) {
          next.add(h.parentElement!.id);
        }
      }
      if (next.size > 0) lastNonEmpty = next;
      setVisible(new Set(lastNonEmpty));
      // Rail/FAB visibility: on the actual text = the sheet's body is
      // roughly filling the viewport (past the hero, above its end).
      const sheetRect = sheet.getBoundingClientRect();
      setOnText(
        sheetRect.top < window.innerHeight * 0.4 && sheetRect.bottom > window.innerHeight * 0.6,
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    // Marks animate in ~100ms after load (also covers the native
    // deep-link anchor jump, which is instant before hydration).
    const initialMeasure = setTimeout(measure, 100);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      clearTimeout(initialMeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Edge-swipe quick-jump below 2xl: touch starting within EDGE px of a screen edge arms the gesture;
  // the first SLOP px commit direction, DIST px open the panel. Non-passive touchmove only while armed
  // (prevents scroll/selection claiming the drag); touchcancel disarms when the browser takes the gesture.
  useEffect(() => {
    if (items.length === 0) return;
    const EDGE = 40;
    const SLOP = 12;
    const DIST = 56;
    let start: { x: number; y: number; side: "left" | "right" } | null = null;

    const onArm = (e: TouchEvent) => {
      if (start || !onTextRef.current) return;
      const touch = e.touches[0];
      let from: "left" | "right" | null = null;
      if (touch.clientX <= EDGE) from = "left";
      else if (touch.clientX >= window.innerWidth - EDGE) from = "right";
      if (!from) return;
      start = { x: touch.clientX, y: touch.clientY, side: from };
      // Non-passive only while the gesture is ours to steer.
      addEventListener("touchmove", onSteer, { passive: false });
    };
    const disarm = () => {
      if (!start) return;
      start = null;
      removeEventListener("touchmove", onSteer);
    };
    const onSteer = (e: TouchEvent) => {
      if (!start) return;
      const touch = e.touches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > SLOP) {
        disarm(); // vertical intent: let scrolling have it
        return;
      }
      if (Math.abs(dx) > SLOP && e.cancelable) e.preventDefault();
      if (Math.abs(dx) > DIST) {
        setSide(start.side);
        setOpen(true);
        disarm();
      }
    };
    addEventListener("touchstart", onArm, { passive: true });
    addEventListener("touchend", disarm, { passive: true });
    addEventListener("touchcancel", disarm, { passive: true });
    return () => {
      disarm();
      removeEventListener("touchstart", onArm);
      removeEventListener("touchend", disarm);
      removeEventListener("touchcancel", disarm);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  // Rail items: a leading chevron marks the sections on screen (slides
  // in, standard TOC affordance) - text bolds and nudges inward slightly.
  const railList = (
    <ul className="flex max-h-[70vh] flex-col items-stretch gap-1 overflow-y-auto py-1">
      {items.map((item) => {
        const on = visible.has(item.id);
        return (
          <li key={item.id} className="flex items-center gap-0.5">
            <span aria-hidden className="flex w-3.5 shrink-0 justify-center">
              <ChevronRight
                className={cn(
                  "size-3.5 text-primary",
                  on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                )}
              />
            </span>
            <button
              type="button"
              onClick={() => jump(item.id)}
              aria-current={on ? "true" : undefined}
              className={cn(
                "w-full truncate rounded-md py-1 text-left hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                on
                  ? "pl-1 text-base font-semibold text-foreground"
                  : "pl-1 text-sm font-normal text-foreground/50",
              )}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {createPortal(
        <>
          {/* Hung off the sheet's left edge (2xl+), shown only while the article text is on screen. */}
          <nav
            aria-label={t("a11y.toc")}
            className={cn(
              "fixed top-1/2 z-40 hidden w-56 -translate-y-1/2 transition-all duration-300 2xl:block",
              "left-[calc(max((100vw-72rem)/2+2rem,2rem)-14.5rem)]" /* sheet half-width (24rem) + gap, floor 2rem */,
              "rounded-xl border border-foreground/10 bg-background p-2 shadow-lg",
              onText ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0",
            )}
          >
            {railList}
          </nav>
        </>,
        document.body,
      )}

      {/* inset-y-0 + my-auto + h-fit centers without transform, keeping the slide-in animation alive. */}
      {items.length > 0 && (
        <Sheet modal={false} open={open} onOpenChange={setOpen}>
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
              {items.map((item) => {
                const on = visible.has(item.id);
                return (
                  <li key={item.id} className="flex items-center gap-0.5">
                    <span aria-hidden className="flex w-3.5 shrink-0 justify-center">
                      <ChevronRight
                        className={cn(
                          "size-3.5 text-primary transition-all duration-300",
                          on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                        )}
                      />
                    </span>
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={() => jump(item.id)}
                        aria-current={on ? "true" : undefined}
                        className={cn(
                          "w-full truncate rounded-lg py-1 text-left text-sm hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          on ? "font-semibold text-foreground" : "font-normal text-foreground/70",
                        )}
                      >
                        {item.label}
                      </button>
                    </SheetClose>
                  </li>
                );
              })}
            </ul>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
