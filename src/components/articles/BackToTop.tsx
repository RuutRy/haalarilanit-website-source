import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { useScrollState } from "@/lib/useScrollState";

// Back-to-top: a threshold affordance, green everywhere (see
// .browserslistrc). Visibility is a class toggle computed from the
// shared scroll state: past 35% of the page's own scrollable range it
// appears, below it (and at page top) it is hidden - instant with
// scroll position, the short CSS transition only smooths the flip.
// The remark plugin injects the button as the content sheet's last
// child and position: sticky makes it ride the viewport bottom while
// the article runs below the fold, docking at the sheet's end as the
// footer arrives: the sticky containing block is the sheet itself, so
// the button can never overlay the footer or slide under the header.
//
// Pages whose scrollable range is under MIN_SCROLL_PX aren't worth the
// button: the box is display:none'd (its sticky slot included), and it
// never renders its visible state there.
const MIN_SCROLL_PX = 300;
// Appear past 35% of the page's scrollable range: long pages show it
// around where the hero leaves, shorter ones proportionally earlier.
// Percent-of-page, never a hardcoded viewport count.
const FADE_FROM = 0.35;

export function BackToTop() {
  const { t } = useTranslation();
  const { y, scrollable } = useScrollState();
  const longEnough = scrollable > MIN_SCROLL_PX;
  const past = y > scrollable * FADE_FROM;

  return (
    // no-reveal keeps the section-reveal view() animation (which targets
    // direct sheet children) from overriding the visibility classes. The
    // flow slot the box occupies at the sheet end reads as trailing
    // padding when docked; on too-short pages the box is gone entirely
    // (hidden), so it doesn't read as stray padding.
    <div
      className={
        "no-reveal back-to-top sticky bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex w-full justify-end transition-opacity duration-300" +
        (longEnough ? (past ? " opacity-100" : " opacity-0 pointer-events-none") : " hidden")
      }
    >
      <Hint label={t("a11y.go_up")}>
        <Button
          size="icon"
          aria-label={t("a11y.back_to_top")}
          className="size-12 rounded-full shadow-lg"
          onClick={() => {
            scrollTo({ top: 0, behavior: "smooth" });
            // Clear the section hash: a refresh after jumping to top
            // lands on the hero, not back at the section.
            history.replaceState(null, "", location.pathname);
          }}
        >
          <ArrowUp className="size-5" />
        </Button>
      </Hint>
    </div>
  );
}
