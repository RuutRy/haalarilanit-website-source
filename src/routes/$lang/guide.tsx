import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { articleMeta } from "../../lib/content-meta";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/guide")({
  head: ({ params }) =>
    seoHead({
      path: `/${currentLang()}/guide`,
      ...articleMeta("guide", params.lang),
    }),
  component: GuidePage,
});

function GuidePage() {
  const { lang } = Route.useParams();
  return <Article name="guide" lang={lang} />;
}
