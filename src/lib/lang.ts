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

// Marker meta stamped on prerendered 404 documents; the value is the
// language the document renders in. The inline head script in __root
// (placed after HeadContent so the meta is already parsed) reads it
// pre-paint and sends every 404 document's visitor to /<lang>/404 - a
// real prerendered page in that language - before anything paints.
// Valid pages have no marker.
export const LANG_404_META_NAME = "haalarilanit-404";

// Remembered language choice: the URL owns language everywhere, but the
// bare root "/" is language-agnostic - the inline head script in __root
// sends a returning visitor from / to their stored tree before anything
// paints. Only an explicit toggle click stores; visits never do.
const LANG_STORAGE_KEY = "lang";

export function storeLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Private browsing etc. may deny storage: the choice just does not
    // persist, everything else keeps working.
  }
}

export function storedLang(): Lang | null {
  try {
    const value = localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

// The language a request renders in. Tree paths follow the URL - an
// explicit /fi or /en visit is intentional. Paths outside both trees
// (404 territory, the bare root) render in the remembered language when
// there is one, falling back to the default tree. localStorage exists
// only in the browser, so on the server this is always the URL language.
export function preferredLang(pathname: string): Lang {
  return isLang(pathname.split("/")[1])
    ? langFromPath(pathname)
    : (storedLang() ?? langFromPath(pathname));
}
