import { createFileRoute } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { articleMeta } from "../../lib/content-meta";
import { event, eventYear } from "../../lib/data";
import { currentLang, eventJsonLd, seoHead } from "../../lib/metadata";

// Title follows the site name like the og:image alt ("Haalarilanit 2026
// logotype"); the description rides the article's frontmatter and feeds
// both the meta and the JSON-LD.
export const Route = createFileRoute("/$lang/")({
  head: ({ params }) => {
    const description = articleMeta("main", params.lang).description;
    return seoHead({
      path: `/${currentLang()}`,
      title: `${event.name} ${eventYear}`,
      description,
      jsonLd: description ? eventJsonLd(description) : undefined,
    });
  },
  component: MainPage,
});

function MainPage() {
  const { lang } = Route.useParams();
  return <Article name="main" lang={lang} />;
}
