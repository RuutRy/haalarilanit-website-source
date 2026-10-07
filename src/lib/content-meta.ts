// Per-article meta from mdx frontmatter (see vite.config.ts): title +
// description ride the content they describe. Missing translation falls back
// to the fi tree like Article does; missing frontmatter yields no fields, so
// the page falls back to the site defaults from the root head.

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

// The effective article for a lang (fi fallback), same resolution as Article.
export function articleMeta(name: string, lang: string): Frontmatter {
  const active = isLang(lang) ? lang : DEFAULT_LANG;
  const mod = articles[`../content/${active}/${name}.mdx`] ?? articles[`../content/fi/${name}.mdx`];
  return mod?.frontmatter ?? {};
}
