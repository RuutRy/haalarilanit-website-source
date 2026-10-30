import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "../../components/NotFoundPage";
import i18n from "../../lib/i18n";
import { DEFAULT_LANG, isLang, LANG_404_META_NAME } from "../../lib/lang";

// Per-tree prerendered 404s so every 404 renders in exactly its language. /fi/404 doubles
// as the static host's 404 doc; the __root head script bounces pre-paint, marker meta avoids a loop.
export const Route = createFileRoute("/$lang/404")({
  head: ({ params }) => ({
    meta: [
      { title: i18n.t("not_found.header") },
      { name: "description", content: i18n.t("not_found.text") },
      { property: "og:description", content: i18n.t("not_found.text") },
      { name: "robots", content: "noindex" },
      { name: LANG_404_META_NAME, content: isLang(params.lang) ? params.lang : DEFAULT_LANG },
    ],
  }),
  component: NotFoundPage,
});
