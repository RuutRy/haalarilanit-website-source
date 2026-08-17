import { Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import i18n from "../lib/i18n";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

const linkClass =
  "rounded-lg px-4 py-2 text-milk transition-colors hover:bg-milk/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const languageOptions = [
  { code: "fi", label: "FI" },
  { code: "en", label: "EN" },
] as const;

// Subtle segmented FI | EN control, pinned to the top right of the
// header.
function LanguageToggle() {
  const current = i18n.resolvedLanguage ?? "fi";

  return (
    <div
      role="group"
      aria-label="Kieli / Language"
      className="flex overflow-hidden rounded-md border border-milk/10"
    >
      {languageOptions.map((option) => {
        const selected = current === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={selected}
            onClick={() => i18n.changeLanguage(option.code)}
            className={cn(
              "w-10 px-2 py-1.5 text-center text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              selected ? "bg-milk/10 text-milk" : "text-milk/40 hover:text-milk",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();
  const resolvedLanguage = i18n.resolvedLanguage ?? "fi";

  useEffect(() => {
    document.documentElement.lang = resolvedLanguage;
  }, [resolvedLanguage]);

  const links = [
    { to: "/", label: t("nav.main") },
    { to: "/rules", label: t("nav.rules") },
    { to: "/guide", label: t("nav.guidance") },
    { to: "/tournament", label: t("nav.tournaments") },
    { to: "/contact", label: t("nav.contacts") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-ink px-4 py-2">
      {/* Three-column grid keeps the nav perfectly centered and the
          language toggle pinned top-right on every breakpoint -
          hamburger on the left, toggle on the right, never swapped */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Sheet modal={false}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="col-start-1 justify-self-start text-accent md:hidden"
              aria-label="Avaa valikko"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-r-milk/10 bg-ink p-4 text-milk">
            {/* mt-14 clears the absolutely positioned close button in
                the sheet's top right corner */}
            <div className="mt-14 flex flex-col gap-1">
              {links.map((link) => (
                <SheetClose asChild key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(linkClass, "w-full py-3 text-left text-lg")}
                    activeProps={{
                      className: cn(
                        linkClass,
                        "bg-accent text-white",
                        "w-full py-3 text-left text-lg",
                      ),
                    }}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <nav className="col-start-2 hidden flex-wrap items-center justify-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={linkClass}
              activeProps={{ className: cn(linkClass, "bg-accent text-white") }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-3 justify-self-end">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
