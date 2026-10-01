import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  // viewport).
  //
  // The live measurement must NOT run during hydration: a reload lands on
  // the restored scroll position before React hydrates, so the hero is
  // already gone and the client's first render would say "unparked" against
  // the SSR's parked markup - an attribute mismatch React does not patch up,
  // which parks the logo until the next real scroll. Until mounted, the
  // hero counts as never-gone (Infinity), matching the parked SSR state;
  // the mount re-render is a plain client render and patches the class.
  const isMain = stripLang(pathname) === "" || stripLang(pathname) === "/";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { y, vh } = useScrollState();
  const headerRef = useRef<HTMLElement>(null);
  const heroLogo =
    !mounted || !isMain ? null : document.querySelector<HTMLElement>("[data-hero-logo]");
  const heroBottom = heroLogo?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
  const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
  const parked = isMain && y <= vh && heroBottom > headerBottom - HERO_GRACE_PX;

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-background py-2">
      {/* Three-column grid: hamburger right on mobile (toggle lives in its menu), inline nav centered, toggle right on desktop. The max-w-6xl + px-4/sm:px-8 geometry matches main and the footer, so every band's content edges align. */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-8">
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
