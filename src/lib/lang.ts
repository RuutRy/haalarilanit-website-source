import { useTranslation } from "react-i18next";

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

export function langFromPath(pathname: string): Lang {
  const segment = pathname.split("/")[1];
  return isLang(segment) ? segment : DEFAULT_LANG;
}

// The active tree's language. i18n is initialized from the URL and
// re-synced in route beforeLoad, so i18n.language IS the URL language;
// isLang guards renders outside both trees.
export function useActiveLang(): Lang {
  const { i18n } = useTranslation();
  return isLang(i18n.language) ? i18n.language : DEFAULT_LANG;
}
