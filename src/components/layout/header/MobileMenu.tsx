import { Link, useRouterState } from "@tanstack/react-router";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { langFromPath } from "@/lib/lang";
import { isActiveLink, NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { activeClass, linkClass } from "./link-classes";

// Hamburger below `compact` (grid col 3); the sheet drops from under the
// button and the burger morphs into an X while open - no close button inside.
export function MobileMenu() {
  const { t } = useTranslation();
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative col-start-3 justify-self-end text-primary compact:hidden"
          aria-label={open ? t("a11y.close_menu") : t("a11y.open_menu")}
        >
          {/* Stacked menu/X; the trigger's data-state runs the morph. */}
          <MenuIcon className="absolute inset-0 m-auto size-7 transition-all duration-300 group-data-[state=open]/button:-rotate-90 group-data-[state=open]/button:scale-0 group-data-[state=open]/button:opacity-0" />
          <XIcon className="absolute inset-0 m-auto size-7 -rotate-90 scale-0 opacity-0 transition-all duration-300 group-data-[state=open]/button:rotate-0 group-data-[state=open]/button:scale-100 group-data-[state=open]/button:opacity-100" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlay={false}
        // Borderless frosted card; border-l-0 kills the primitive's side border.
        className="h-fit max-h-[75dvh] w-64 origin-top-right overflow-y-auto rounded-xl bg-(--panel-tint) p-4 text-foreground backdrop-blur-lg data-[side=right]:top-[calc(var(--header-h)_+_0.5rem)] data-[side=right]:bottom-auto data-[side=right]:h-auto data-[side=right]:border-l-0 data-[side=right]:right-4 data-[side=right]:w-64 data-[side=right]:data-open:zoom-in-95 data-[side=right]:data-open:[--tw-enter-translate-x:0]! data-[side=right]:data-closed:zoom-out-95 data-[side=right]:data-closed:[--tw-exit-translate-x:0]!"
      >
        <div className="flex flex-col gap-1">
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
        {/* Lang toggle only below compact (header owns it above); ml lines
            the FI/EN labels up with the link labels. */}
        <div className="mt-6 ml-[calc(1rem-0.5rem-1px)] compact:hidden">
          <LangToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
