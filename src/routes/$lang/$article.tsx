import { createFileRoute, notFound } from "@tanstack/react-router";

import { Article } from "../../components/text";
import { articleExists, articleMeta } from "../../lib/content-meta";
import { currentLang, seoHead } from "../../lib/metadata";

// One route for every article: the mdx set (src/content/fi/*.mdx) is the
// source of truth, so adding an article needs no route file. Static
// siblings (index, 404) win over $article on path precedence.
//
// "main" is rejected: the index route renders it with its own SEO/JSON-LD,
// and /fi/main duplicating /fi is a soft SEO duplicate.
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
