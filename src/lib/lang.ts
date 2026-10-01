export const LANGS = ["fi", "en"] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "fi";

// Narrow an untrusted string to a Lang; false when not a tree.
export function isLang(value: string | undefined | null): value is Lang {
  return (LANGS as readonly string[]).includes(value ?? "");
}

// Path without its language segment ("/fi/guide" -> "/guide").
export function stripLang(pathname: string): string {
  const segment = pathname.split("/")[1];
  return isLang(segment) ? pathname.slice(1 + segment.length) : pathname;
}

// Language implied by a URL path; anything without a known lang
// segment is the default tree.
export function langFromPath(pathname: string): Lang {
  const segment = pathname.split("/")[1];
  return isLang(segment) ? segment : DEFAULT_LANG;
}
