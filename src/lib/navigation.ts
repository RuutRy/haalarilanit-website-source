import { stripLang } from "./lang";

// Tree navigation, single source of truth: the header's section links
// and the language toggle both read it. Only these routes exist in
// both language trees; any other tail (e.g. /not-found) has no
// counterpart and falls back to the tree root.
export const NAV_SECTIONS = [
  { to: "/$lang", labelKey: "nav.main" },
  { to: "/$lang/rules", labelKey: "nav.rules" },
  { to: "/$lang/guide", labelKey: "nav.guidance" },
  { to: "/$lang/tournament", labelKey: "nav.tournaments" },
  { to: "/$lang/contact", labelKey: "nav.contacts" },
] as const;

// Does this nav link point at the current page? The root link matches
// the bare lang tree only; section links match their subtree. The
// highlight derives from the pathname alone: it flips the instant the
// route changes and never flickers mid-scroll.
export function isActiveLink(pathname: string, to: string): boolean {
  const tail = stripLang(pathname);
  const target = to.replace("/$lang", "");
  if (target === "") return tail === "" || tail === "/";
  return tail.startsWith(target);
}

// Same page, other tree: strip the lang segment and navigate by route id.
// Keep the tail only when it names a route that exists in both trees (the
// root and the header sections); anything else - e.g. /not-found - falls
// back to the tree root: the toggle must never link into a 404.
// Directory-style hosts hand out trailing-slash URLs ("/fi/rules/") -
// normalize so they still match their section.
export function resolveLangTarget(pathname: string): string {
  const tail = stripLang(pathname);
  const normalizedTail = tail === "" || tail === "/" ? "" : tail.replace(/\/+$/, "");
  return NAV_SECTIONS.some((section) => section.to === `/$lang${normalizedTail}`)
    ? normalizedTail
    : "";
}
