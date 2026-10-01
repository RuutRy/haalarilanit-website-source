import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";

export const Route = createFileRoute("/$lang/rules")({
  head: () => ({ meta: [{ title: `${i18n.t("nav.rules")} - Haalarilanit` }] }),
  component: RulesPage,
});

function RulesPage() {
  const { lang } = Route.useParams();
  return <Article name="rules" lang={lang} />;
}
