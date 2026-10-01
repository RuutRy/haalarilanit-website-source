import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "../../components/NotFoundPage";
import i18n from "../../lib/i18n";
import { DEFAULT_LANG, isLang, LANG_404_META_NAME } from "../../lib/lang";

// Per-tree prerendered 404s, so every 404 renders in exactly its language
// (no hydration flip). /fi/404 doubles as the static host's single 404
// document (responseOverrides); the head script in __root bounces visitors
// to the right tree pre-paint, and the marker meta prevents a redirect loop.
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
