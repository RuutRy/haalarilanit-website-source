import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { langFromPath } from "@/lib/lang";
import { isActiveLink, NAV_SECTIONS, navPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { activeClass, linkClass } from "./link-classes";

// flex-nowrap keeps it one row; compact/fit decide when each size fits.
export function HeaderNav() {
  const { t } = useTranslation();
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="col-start-2 hidden flex-nowrap items-center justify-center gap-0.5 text-lg whitespace-nowrap compact:flex fit:gap-1 fit:text-fluid">
      {NAV_SECTIONS.map((link) => {
        const active = isActiveLink(pathname, navPath(link));
        const className = cn(linkClass, active && activeClass);
        // Article sections route through the shared $article route; the
        // root link has its own path.
        if ("article" in link) {
          return (
            <Link
              key={navPath(link)}
              to="/$lang/$article"
              params={{ lang, article: link.article }}
              className={className}
            >
              {t(link.labelKey)}
            </Link>
          );
        }
        return (
          <Link key={navPath(link)} to={link.to} params={{ lang }} className={className}>
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
