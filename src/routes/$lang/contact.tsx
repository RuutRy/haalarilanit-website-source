import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/contact")({
  head: () =>
    seoHead({
      path: `/${currentLang()}/contact`,
      title: `${i18n.t("nav.contacts")} - Haalarilanit`,
      description: i18n.t("meta.contacts"),
    }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = Route.useParams();
  return <Article name="contact" lang={lang} />;
}
