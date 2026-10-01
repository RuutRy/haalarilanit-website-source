import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import i18n from "../../lib/i18n";

export const Route = createFileRoute("/$lang/")({
  head: () => ({
    meta: [
      { name: "description", content: i18n.t("meta.main") },
      { property: "og:description", content: i18n.t("meta.main") },
    ],
  }),
  component: MainPage,
});

function MainPage() {
  const { lang } = Route.useParams();
  return <Article name="main" lang={lang} />;
}
