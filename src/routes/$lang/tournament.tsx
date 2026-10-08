import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { articleMeta } from "../../lib/content-meta";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/tournament")({
  head: ({ params }) =>
    seoHead({
      path: `/${currentLang()}/tournament`,
      ...articleMeta("tournament", params.lang),
    }),
  component: TournamentPage,
});

function TournamentPage() {
  const { lang } = Route.useParams();
  return <Article name="tournament" lang={lang} />;
}
