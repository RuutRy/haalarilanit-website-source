import { stripLang } from "./lang";

// Tree navigation, single source of truth: the header's section links
// and the language toggle both read it. Only these routes exist in
// both language trees; any other tail (e.g. a broken URL) has no
// counterpart and falls back to the tree root.
export const NAV_SECTIONS = [
  { to: "/$lang", labelKey: "nav.main" },
  { to: "/$lang/rules", labelKey: "nav.rules" },
  { to: "/$lang/guide", labelKey: "nav.guidance" },
  { to: "/$lang/tournament", labelKey: "nav.tournaments" },
  { to: "/$lang/contact", labelKey: "nav.contacts" },
] as const;

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
  return NAV_SECTIONS.some((section) => section.to === `/$lang${normalizedTail}`)
    ? normalizedTail
    : "";
}
