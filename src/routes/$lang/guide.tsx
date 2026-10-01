import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";

export const Route = createFileRoute("/$lang/guide")({
  head: () => ({ meta: [{ title: `${i18n.t("nav.guidance")} - Haalarilanit` }] }),
  component: GuidePage,
});

function GuidePage() {
  const { lang } = Route.useParams();
  return <Article name="guide" lang={lang} />;
}
