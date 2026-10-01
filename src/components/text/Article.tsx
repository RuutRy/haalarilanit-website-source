import type { ComponentType } from "react";

import { DEFAULT_LANG, isLang } from "@/lib/lang";
import type { MDXComponents } from "@/lib/mdx";

import { mdxComponents, WRAPPER } from "./mdx-components";

const articles = import.meta.glob<{
  default: ComponentType<{ components?: MDXComponents }>;
}>("../../content/**/*.mdx", { eager: true });

export function Article({ name, lang }: { name: string; lang: string }) {
  const active = isLang(lang) ? lang : DEFAULT_LANG;
  const path = `../../content/${active}/${name}.mdx`;
  const mod = articles[path];

  if (!mod) {
    // Missing translation falls back to the default tree.
    if (active !== "fi") console.warn(`article "${name}" missing for lang "${active}", using fi`);
    const fallback = articles[`../../content/fi/${name}.mdx`];
    if (!fallback) return null;
    return (
      <div className={WRAPPER}>
        <fallback.default components={mdxComponents} />
      </div>
    );
  }

  return (
    <div className={WRAPPER}>
      <mod.default components={mdxComponents} />
    </div>
  );
}
