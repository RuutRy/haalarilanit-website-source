import { stripLang } from "./lang";

// Single source of truth for header sections, the footer site column and the
// language toggle. Articles share the $article route, so the Link `to` is generic.
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

// Concrete path (e.g. "/$lang/rules"): active-state matching and lang-toggle
// resolution work on these, while links route through the shared $article route.
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
