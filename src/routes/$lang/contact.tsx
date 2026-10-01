import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";

export const Route = createFileRoute("/$lang/contact")({
  head: () => ({
    meta: [
      { title: `${i18n.t("nav.contacts")} - Haalarilanit` },
      { name: "description", content: i18n.t("meta.contacts") },
      { property: "og:description", content: i18n.t("meta.contacts") },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = Route.useParams();
  return <Article name="contact" lang={lang} />;
}
