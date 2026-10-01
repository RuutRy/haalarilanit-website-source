import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";

export const Route = createFileRoute("/$lang/tournament")({
  head: () => ({
    meta: [
      { title: `${i18n.t("nav.tournaments")} - Haalarilanit` },
      { name: "description", content: i18n.t("meta.tournaments") },
      { property: "og:description", content: i18n.t("meta.tournaments") },
    ],
  }),
  component: TournamentPage,
});

function TournamentPage() {
  const { lang } = Route.useParams();
  return <Article name="tournament" lang={lang} />;
}
