import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { useScrollState } from "@/hooks/useScrollState";

// Sticky at the sheet's end (the plugin injects it as its last child): rides
// the viewport bottom while the article runs, docks above the footer. Appears
// past FADE_FROM of the scrollable range; hidden on shorter pages. Yields to
// the Discord widget while their boxes overlap (data-discord-widget).
const MIN_SCROLL_PX = 300;
const FADE_FROM = 0.35;

export function BackToTop() {
  const { t } = useTranslation();
  const { y, scrollable } = useScrollState();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [covered, setCovered] = useState(false);
  const longEnough = scrollable > MIN_SCROLL_PX;
  const past = y > scrollable * FADE_FROM;

  const [widget, setWidget] = useState<HTMLElement | null>(null);

  // The widget is rendered by the same article mount; query it once.
  useEffect(() => {
    setWidget(document.querySelector<HTMLElement>("[data-discord-widget]"));
  }, []);

  const measure = useCallback(() => {
    const w = widget?.getBoundingClientRect();
    const b = buttonRef.current?.getBoundingClientRect();
    setCovered(
      !!w && !!b && b.left < w.right && w.left < b.right && b.top < w.bottom && w.top < b.bottom,
    );
  }, [widget]);

  // Scroll-driven check; skipped at page top and on short pages.
  useEffect(() => {
    if (!widget || y === 0 || scrollable <= MIN_SCROLL_PX) {
      setCovered(false);
      return;
    }
    measure();
  }, [widget, y, scrollable, measure]);

  // The widget's expand/collapse resizes without a scroll event.
  useEffect(() => {
    if (!widget) return;
    const observer = new ResizeObserver(measure);
    observer.observe(widget);
    return () => observer.disconnect();
  }, [widget, measure]);

  return (
    // no-reveal: keep the section-reveal animation from overriding the visibility classes.
    <div
      className={
        "no-reveal back-to-top sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex w-full justify-end transition-opacity duration-300" +
        (longEnough
          ? past && !covered
            ? " opacity-100"
            : " opacity-0 pointer-events-none"
          : " hidden")
      }
    >
      <Hint label={t("a11y.go_up")}>
        <Button
          ref={buttonRef}
          size="icon"
          aria-label={t("a11y.back_to_top")}
          className="size-12 rounded-full shadow-lg"
          onClick={() => {
            scrollTo({ top: 0, behavior: "smooth" });
            // Clear the section hash so a refresh lands on the hero.
            history.replaceState(null, "", location.pathname);
          }}
        >
          <ArrowUp className="size-5" />
        </Button>
      </Hint>
    </div>
  );
}
