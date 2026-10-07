import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { articleMeta } from "../../lib/content-meta";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/rules")({
  head: ({ params }) =>
    seoHead({
      path: `/${currentLang()}/rules`,
      ...articleMeta("rules", params.lang),
    }),
  component: RulesPage,
});

function RulesPage() {
  const { lang } = Route.useParams();
  return <Article name="rules" lang={lang} />;
}
