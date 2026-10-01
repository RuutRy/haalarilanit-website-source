import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/rules")({
  head: () =>
    seoHead({
      path: `/${currentLang()}/rules`,
      title: `${i18n.t("nav.rules")} - Haalarilanit`,
      description: i18n.t("meta.rules"),
    }),
  component: RulesPage,
});

function RulesPage() {
  const { lang } = Route.useParams();
  return <Article name="rules" lang={lang} />;
}
