import { createFileRoute, notFound } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { articleExists, articleMeta } from "../../lib/content-meta";
import { currentLang, seoHead } from "../../lib/metadata";

// One route for every article: the mdx set is the source of truth, so adding
// one needs no route file. "main" is rejected so /fi/main doesn't duplicate /fi.
export const Route = createFileRoute("/$lang/$article")({
  beforeLoad: ({ params }) => {
    if (params.article === "main" || !articleExists(params.article)) throw notFound();
  },
  head: ({ params }) =>
    seoHead({
      path: `/${currentLang()}/${params.article}`,
      ...articleMeta(params.article, params.lang),
    }),
  component: ArticlePage,
});

function ArticlePage() {
  const { lang, article } = Route.useParams();
  return <Article name={article} lang={lang} />;
}
