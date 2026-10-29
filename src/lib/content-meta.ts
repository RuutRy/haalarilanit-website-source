// Per-article meta from mdx frontmatter. Missing translation falls back to the
// fi tree like Article does; missing frontmatter leaves the root head's defaults.

import type { ComponentType } from "react";

import { DEFAULT_LANG, isLang } from "./lang";

interface Frontmatter {
  title?: string;
  description?: string;
}

const articles = import.meta.glob<{
  default: ComponentType;
  frontmatter?: Frontmatter;
}>("../content/**/*.mdx", { eager: true });

// Same fi fallback as Article.
export function articleMeta(name: string, lang: string): Frontmatter {
  const active = isLang(lang) ? lang : DEFAULT_LANG;
  const mod = articles[`../content/${active}/${name}.mdx`] ?? articles[`../content/fi/${name}.mdx`];
  return mod?.frontmatter ?? {};
}

// Does the article exist at all? The fi tree defines the article set; the
// en tree only shadows it. Used by the $article route to 404 unknown names.
export function articleExists(name: string): boolean {
  return Boolean(articles[`../content/fi/${name}.mdx`]);
}
