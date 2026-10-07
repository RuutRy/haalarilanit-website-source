import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { articleMeta } from "../../lib/content-meta";
import { currentLang, seoHead } from "../../lib/metadata";

export const Route = createFileRoute("/$lang/contact")({
  head: ({ params }) =>
    seoHead({
      path: `/${currentLang()}/contact`,
      ...articleMeta("contact", params.lang),
    }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = Route.useParams();
  return <Article name="contact" lang={lang} />;
}
