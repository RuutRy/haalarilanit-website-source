import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/guide")({
  head: () =>
    seoHead({
      path: `/${currentLang()}/guide`,
      title: `${i18n.t("nav.guidance")} - Haalarilanit`,
      description: i18n.t("meta.guidance"),
    }),
  component: GuidePage,
});

function GuidePage() {
  const { lang } = Route.useParams();
  return <Article name="guide" lang={lang} />;
}
