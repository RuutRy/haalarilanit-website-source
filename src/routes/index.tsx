import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../components/text";
import { articleMeta } from "../lib/content-meta";
import { event, eventYear } from "../lib/data";
import { syncRouteLanguage } from "../lib/i18n";
import { DEFAULT_LANG } from "../lib/lang";
import { eventJsonLd, seoHead } from "../lib/metadata";

// Root serves the default (Finnish) tree's front page - identical to /fi,
// canonical points there. No client-side language redirect.
export const Route = createFileRoute("/")({
  beforeLoad: ({ preload }) => {
    syncRouteLanguage(preload, DEFAULT_LANG);
  },
  head: () => {
    const description = articleMeta("main", DEFAULT_LANG).description;
    return seoHead({
      path: "/fi",
      title: `${event.name} ${eventYear}`,
      description,
      jsonLd: description ? eventJsonLd(description) : undefined,
    });
  },
  component: MainPage,
});

function MainPage() {
  return <Article name="main" lang={DEFAULT_LANG} />;
}
