import { createFileRoute } from "@tanstack/react-router";

import { PageContent } from "../../components/layout";
import { Article } from "../../components/text";
import { DEFAULT_LANG, isLang } from "../../lib/lang";

export const Route = createFileRoute("/$lang/rules")({
  component: RulesPage,
});

function RulesPage() {
  const { lang: langParam } = Route.useParams();
  const lang = isLang(langParam) ? langParam : DEFAULT_LANG;

  return (
    <PageContent>
      <Article name="rules" lang={lang} />
    </PageContent>
  );
}
