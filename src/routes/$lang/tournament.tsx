import { createFileRoute } from "@tanstack/react-router";

import { PageContent } from "../../components/layout";
import { Article } from "../../components/text";
import { DEFAULT_LANG, isLang } from "../../lib/lang";

export const Route = createFileRoute("/$lang/tournament")({
  component: TournamentPage,
});

function TournamentPage() {
  const { lang: langParam } = Route.useParams();
  const lang = isLang(langParam) ? langParam : DEFAULT_LANG;

  return (
    <PageContent>
      <Article name="tournament" lang={lang} />
    </PageContent>
  );
}
