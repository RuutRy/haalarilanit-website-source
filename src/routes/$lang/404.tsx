import { createFileRoute } from "@tanstack/react-router";

import i18n from "../../lib/i18n";
import { DEFAULT_LANG, isLang, LANG_404_META_NAME } from "../../lib/lang";
import { NotFoundPage } from "../not-found";

// Per-tree 404 destinations (/fi/404, /en/404): real prerendered pages,
// so every 404 renders from a document written in exactly its language -
// no hydration flip. The head script in __root bounces every 404 hit
// here pre-paint (soft navigations via root beforeLoad); the marker meta
// tells it which language this document already renders in, which is
// also what keeps the redirect from looping.
export const Route = createFileRoute("/$lang/404")({
  head: ({ params }) => ({
    meta: [
      { title: i18n.t("not_found.header") },
      { name: "robots", content: "noindex" },
      { name: LANG_404_META_NAME, content: isLang(params.lang) ? params.lang : DEFAULT_LANG },
    ],
  }),
  component: NotFoundPage,
});
