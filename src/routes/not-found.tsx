import { Link, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import i18n from "../lib/i18n";
import { DEFAULT_LANG, LANG_404_META_NAME, preferredLang, useActiveLang } from "../lib/lang";

// The not-found card subscribes to i18n (useTranslation) so a language
// sync re-renders it. Raw i18n.t calls would render once and never
// follow the change.
//
// 404s always render at /<lang>/404 (one rule for every entry mode):
// full-page loads bounce pre-paint via the head script in __root,
// language-less soft navigations via root beforeLoad - and tree-path
// soft navigations (which beforeLoad cannot predict) land here and
// navigate themselves, history-replaced so back skips the broken URL.
export function NotFoundPage() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    const lang = preferredLang(pathname);
    if (pathname !== `/${lang}/404`) {
      navigate({ to: "/$lang/404", params: { lang }, replace: true });
    }
  }, [pathname, navigate]);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <h1 className="text-h1-fluid">{t("not_found.header")}</h1>
      <p>{t("not_found.text")}</p>
      <Link
        to="/$lang"
        params={{ lang: useActiveLang() }}
        className="text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("not_found.home")}
      </Link>
    </div>
  );
}

export const Route = createFileRoute("/not-found")({
  head: () => ({
    meta: [
      { title: i18n.t("not_found.header") },
      { name: "robots", content: "noindex" },
      // This prerender is the static host's Finnish 404 document
      // (responseOverrides) - the trampoline the head script bounces
      // language-mismatched visitors off. The marker names the language
      // the document renders in; the per-tree 404 pages stamp their own.
      { name: LANG_404_META_NAME, content: DEFAULT_LANG },
    ],
  }),
  component: NotFoundPage,
});
