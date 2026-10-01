import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { langFromPath } from "@/lib/lang";
import { isActiveLink, NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { activeClass, linkClass } from "./link-classes";

// Desktop inline nav, centered in the header grid.
export function HeaderNav() {
  const { t } = useTranslation();
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="col-start-2 hidden flex-wrap items-center justify-center gap-1 md:flex">
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
