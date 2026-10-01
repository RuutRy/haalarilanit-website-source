import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { langFromPath } from "@/lib/lang";
import { isActiveLink, NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { activeClass, linkClass } from "./link-classes";

// Desktop inline nav, centered in the header grid; flex-nowrap keeps it
// one row - compact/fit decide when each size fits.
export function HeaderNav() {
  const { t } = useTranslation();
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="col-start-2 hidden flex-nowrap items-center justify-center gap-0.5 text-lg whitespace-nowrap compact:flex fit:gap-1 fit:text-fluid">
      {NAV_SECTIONS.map((link) => {
        const active = isActiveLink(pathname, link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            params={{ lang }}
            className={cn(linkClass, active && activeClass)}
          >
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
