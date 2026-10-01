import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../components/text";
import { SITE_URL } from "../lib/data";
import i18n, { syncRouteLanguage } from "../lib/i18n";
import { DEFAULT_LANG } from "../lib/lang";

// Root serves the default (Finnish) tree's front page - identical to /fi,
// canonical points there. No client-side language redirect.
export const Route = createFileRoute("/")({
  beforeLoad: ({ preload }) => {
    syncRouteLanguage(preload, DEFAULT_LANG);
  },
  head: () => ({
    meta: [
      { name: "description", content: i18n.t("meta.main") },
      { property: "og:description", content: i18n.t("meta.main") },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/fi` }],
  }),
  component: MainPage,
});

function MainPage() {
  return <Article name="main" lang={DEFAULT_LANG} />;
}
