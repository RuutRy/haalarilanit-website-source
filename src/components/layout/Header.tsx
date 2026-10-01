import { Link, useRouterState } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useScrollState } from "@/lib/useScrollState";
import { cn } from "@/lib/utils";

import { LANGS, langFromPath, stripLang } from "../../lib/lang";
import { Logo } from "../media/Logo";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

const linkClass =
  "rounded-lg px-4 py-2 text-foreground hover:bg-foreground/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

// The lit state - instant by design (no transition): the selection is
// always exactly where you are.
const activeClass = "bg-primary text-foreground";

// Does this nav link point at the current page? The root link matches
// the bare lang tree only; section links match their subtree. The
// highlight derives from the pathname alone: it flips the instant the
// route changes and never flickers mid-scroll.
function isActiveLink(pathname: string, to: string) {
  const tail = stripLang(pathname);
  const target = to.replace("/$lang", "");
  if (target === "") return tail === "" || tail === "/";
  return tail.startsWith(target);
}

const languageOptions = LANGS.map((code) => ({ code, label: code.toUpperCase() }));

// Subtle segmented FI | EN control, pinned to the top right of the
// header (desktop) and reused in the mobile menu + footer. Real links
// to the same page in the other tree: crawlable (the prerender crawler
// crosses trees through these), no-JS fallback. w-fit matters in the
// mobile menu: a plain flex div there would stretch the pill across
// the whole sheet, leaving the EN cell a vast empty half.
export function LanguageToggle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = langFromPath(pathname);

  // Same page, other tree: strip the lang segment, navigate by route id.
  const tail = stripLang(pathname);
  const target = tail === "" || tail === "/" ? "" : tail;

  return (
    <div
      role="group"
      aria-label="Kieli / Language"
      className="flex w-fit overflow-hidden rounded-md border border-foreground/10"
    >
      {languageOptions.map((option) => {
        const selected = current === option.code;
        return (
          <Link
            key={option.code}
            to={option.code === current ? pathname : `/$lang${target}`}
            params={{ lang: option.code }}
            aria-pressed={selected}
            onClick={() => localStorage.setItem("language", option.code)}
            className={cn(
              "w-10 px-2 py-1.5 text-center text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected
                ? "bg-foreground/10 text-foreground"
                : "text-foreground/40 hover:text-foreground",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // On the main page the hero owns the logo while it's on screen: the
  // small header mark parks hidden until one viewport of scroll. Same
  // green gate as the up button (see useScrollState): instant with
  // scroll position, the mark's transition does the fade.
  const isMain = stripLang(pathname) === "" || stripLang(pathname) === "/";
  const { y, vh } = useScrollState();
  const parked = isMain && y <= vh;

  const links = [
    { to: "/$lang", label: t("nav.main") },
    { to: "/$lang/rules", label: t("nav.rules") },
    { to: "/$lang/guide", label: t("nav.guidance") },
    { to: "/$lang/tournament", label: t("nav.tournaments") },
    { to: "/$lang/contact", label: t("nav.contacts") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-background px-4 py-2">
      {/* Three-column grid keeps the nav perfectly centered. Mobile: the
          hamburger sits top-right (slightly larger for tap comfort) and
          the language toggle lives inside its menu - the quick-jump (TOC)
          is a separate floating button handled by SectionNav. Desktop:
          inline nav center, language toggle pinned right. */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Small site mark, links home. On the main page it parks
            hidden while the hero logo is on screen (green scroll gate -
            see useScrollState) and fades in past it. */}
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
        <Sheet modal={false}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="col-start-3 justify-self-end text-primary md:hidden [&_svg]:size-7"
              aria-label={t("a11y.open_menu")}
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-64 border-l-foreground/10 bg-background p-4 text-foreground"
          >
            {/* mt-14 clears the absolutely positioned close button in
                the sheet's top right corner */}
            <div className="mt-14 flex flex-col gap-1">
              {links.map((link) => {
                const active = isActiveLink(pathname, link.to);
                return (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      params={{ lang }}
                      className={cn(
                        linkClass,
                        "w-full py-3 text-left text-lg",
                        active && activeClass,
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
            {/* Language lives in the menu on mobile - the header toggle
                is desktop-only */}
            <div className="mt-6 md:hidden">
              <LanguageToggle />
            </div>
          </SheetContent>
        </Sheet>

        <nav className="col-start-2 hidden flex-wrap items-center justify-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActiveLink(pathname, link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                params={{ lang }}
                className={cn(linkClass, active && activeClass)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="col-start-3 hidden justify-self-end md:block">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
