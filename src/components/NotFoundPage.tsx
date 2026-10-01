import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { preferredLang, useActiveLang } from "../lib/lang";

// 404s always render at /<lang>/404: full-page loads bounce pre-paint (head
// script in __root), soft navigations via root beforeLoad, and tree-path
// navigations beforeLoad cannot see land here, history-replaced.
export function NotFoundPage() {
  const { t } = useTranslation();
  const lang = useActiveLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const status = useRouterState({ select: (s) => s.status });
  const navigate = useNavigate();

  useEffect(() => {
    // Only on a settled location: a transient mid-navigation pathname
    // would bounce back to /<lang>/404 and cancel the navigation.
    if (status !== "idle") return;
    const lang = preferredLang(pathname);
    if (pathname !== `/${lang}/404`) {
      navigate({ to: "/$lang/404", params: { lang }, replace: true });
    }
  }, [pathname, status, navigate]);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <h1 className="text-h1-fluid">{t("not_found.header")}</h1>
      <p>{t("not_found.text")}</p>
      <Link
        to="/$lang"
        params={{ lang }}
        className="text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("not_found.home")}
      </Link>
    </div>
  );
}
