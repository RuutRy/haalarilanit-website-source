import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";

export const Route = createFileRoute("/$lang/rules")({
  head: () => ({
    meta: [
      { title: `${i18n.t("nav.rules")} - Haalarilanit` },
      { name: "description", content: i18n.t("meta.rules") },
      { property: "og:description", content: i18n.t("meta.rules") },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  const { lang } = Route.useParams();
  return <Article name="rules" lang={lang} />;
}
