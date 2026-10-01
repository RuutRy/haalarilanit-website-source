import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/tournament")({
  head: () =>
    seoHead({
      path: `/${currentLang()}/tournaments`,
      title: `${i18n.t("nav.tournaments")} - Haalarilanit`,
      description: i18n.t("meta.tournaments"),
    }),
  component: TournamentPage,
});

function TournamentPage() {
  const { lang } = Route.useParams();
  return <Article name="tournament" lang={lang} />;
}
