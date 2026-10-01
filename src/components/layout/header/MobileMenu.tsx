import { Link, useRouterState } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { langFromPath } from "@/lib/lang";
import { isActiveLink, NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { activeClass, linkClass } from "./link-classes";

// Hamburger right on mobile (grid col 3); the sheet holds the section
// links and the language toggle - the header toggle is desktop-only.
export function MobileMenu() {
  const { t } = useTranslation();
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
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
          {NAV_SECTIONS.map((link) => {
            const active = isActiveLink(pathname, link.to);
            return (
              <SheetClose asChild key={link.to}>
                <Link
                  to={link.to}
                  params={{ lang }}
                  className={cn(linkClass, "w-full py-3 text-left text-lg", active && activeClass)}
                >
                  {t(link.labelKey)}
                </Link>
              </SheetClose>
            );
          })}
        </div>
        {/* Language lives in the menu on mobile - the header toggle
            is desktop-only */}
        <div className="mt-6 md:hidden">
          <LangToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
