import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { eventYear } from "../../lib/data";
import i18n from "../../lib/i18n";
import { currentLang, eventJsonLd, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/")({
  head: () =>
    seoHead({
      path: `/${currentLang()}`,
      title: i18n.t("meta.title", { year: eventYear }),
      description: i18n.t("meta.main"),
      jsonLd: eventJsonLd(i18n.t("meta.main")),
    }),
  component: MainPage,
});

function MainPage() {
  const { lang } = Route.useParams();
  return <Article name="main" lang={lang} />;
}
