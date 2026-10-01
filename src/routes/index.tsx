import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../components/text";
import { eventYear } from "../lib/data";
import i18n, { syncRouteLanguage } from "../lib/i18n";
import { DEFAULT_LANG } from "../lib/lang";
import { eventJsonLd, seoHead } from "../lib/metadata";

// Root serves the default (Finnish) tree's front page - identical to /fi,
// canonical points there. No client-side language redirect.
export const Route = createFileRoute("/")({
  beforeLoad: ({ preload }) => {
    syncRouteLanguage(preload, DEFAULT_LANG);
  },
  head: () =>
    seoHead({
      path: "/fi",
      title: i18n.t("meta.title", { year: eventYear }),
      description: i18n.t("meta.main"),
      jsonLd: eventJsonLd(i18n.t("meta.main")),
    }),
  component: MainPage,
});

function MainPage() {
  return <Article name="main" lang={DEFAULT_LANG} />;
}
