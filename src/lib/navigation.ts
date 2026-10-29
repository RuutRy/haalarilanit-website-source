import { stripLang } from "./lang";

// Tree navigation, single source of truth: the header's section links,
// the footer's site column, and the language toggle all read it. Only
// these routes exist in both language trees; any other tail (e.g. a
// broken URL) has no counterpart and falls back to the tree root.
//
// Article sections go through the shared $article route (the mdx set is
// the source of truth), so the Link `to` is generic and the article name
// rides the params.
export const NAV_SECTIONS = [
  { to: "/$lang", labelKey: "nav.main" },
  { to: "/$lang/$article", article: "rules", labelKey: "nav.rules" },
  { to: "/$lang/$article", article: "guide", labelKey: "nav.guidance" },
  { to: "/$lang/$article", article: "tournament", labelKey: "nav.tournaments" },
  { to: "/$lang/$article", article: "contact", labelKey: "nav.contacts" },
] as const;

export type NavSection = (typeof NAV_SECTIONS)[number];
export type ArticleSection = Extract<NavSection, { article: string }>;

export const ARTICLE_SECTIONS = NAV_SECTIONS.filter(
  (section): section is ArticleSection => "article" in section,
);

// A section's concrete path (e.g. "/$lang/rules"): active-state matching
// and lang-toggle target resolution work on concrete paths, while the
// links themselves route through the shared $article route.
export function navPath(section: NavSection): string {
  return "article" in section ? `/$lang/${section.article}` : section.to;
}

// Root link matches the bare tree only; section links match their subtree.
export function isActiveLink(pathname: string, to: string): boolean {
  const tail = stripLang(pathname);
  const target = to.replace("/$lang", "");
  if (target === "") return tail === "" || tail === "/";
  return tail.startsWith(target);
}

// Keep the tail only when the route exists in both trees (never link into
// a 404); trailing-slash URLs from static hosts normalize.
export function resolveLangTarget(pathname: string): string {
  const tail = stripLang(pathname);
  const normalizedTail = tail === "" || tail === "/" ? "" : tail.replace(/\/+$/, "");
  return NAV_SECTIONS.some((section) => navPath(section) === `/$lang${normalizedTail}`)
    ? normalizedTail
    : "";
}
