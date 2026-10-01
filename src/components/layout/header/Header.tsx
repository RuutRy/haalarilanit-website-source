import { Link, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { LangToggle } from "@/components/lang-toggle";
import { Logo } from "@/components/media/Logo";
import { useScrollState } from "@/hooks/useScrollState";
import { langFromPath, stripLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

import { HeaderNav } from "./HeaderNav";
import { MobileMenu } from "./MobileMenu";

// The small mark waits until the hero logo has slid fully behind the
// opaque sticky header, plus this much scroll past that - the swap then
// reads as "the hero mark just left", not a whole viewport later.
const HERO_GRACE_PX = 100;

export function Header() {
  const { t } = useTranslation();
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Main page: the hero owns the logo at top; the small mark parks until
  // the hero mark has gone under the header bar (measured live from the
  // hero logo's rect, so the swap tracks the fluid logo size on every
  // viewport). Reads are safe during hydration too: the SSR HTML is
  // already in place, so the hero logo exists when this first runs - and
  // on the server document is absent, which keeps the parked SSR state.
  const isMain = stripLang(pathname) === "" || stripLang(pathname) === "/";
  const { y, vh } = useScrollState();
  const headerRef = useRef<HTMLElement>(null);
  const heroLogo =
    typeof document === "undefined" || !isMain
      ? null
      : document.querySelector<HTMLElement>("[data-hero-logo]");
  const heroBottom = heroLogo?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
  const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
  const parked = isMain && y <= vh && heroBottom > headerBottom - HERO_GRACE_PX;

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-background px-4 py-2">
      {/* Three-column grid: hamburger right on mobile (toggle lives in its menu), inline nav centered, toggle right on desktop. */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link
          to="/$lang"
          params={{ lang }}
          aria-label={t("a11y.logo_alt")}
          className={cn(
            "header-logo col-start-1 justify-self-start transition-all duration-500",
            parked && "header-logo-parked",
          )}
        >
          <Logo size="sm" />
        </Link>
        <MobileMenu />
        <HeaderNav />
        <div className="col-start-3 hidden justify-self-end md:block">
          <LangToggle />
        </div>
      </div>
    </header>
  );
}
