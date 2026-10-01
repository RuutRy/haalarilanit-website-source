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

// i18n.language tracks the URL (synced in route beforeLoad); isLang guards renders outside both trees.
export function useActiveLang(): Lang {
  const { i18n } = useTranslation();
  return isLang(i18n.language) ? i18n.language : DEFAULT_LANG;
}

// Marker meta on prerendered 404 documents naming their language (read
// pre-paint by the head script in __root). Valid pages have no marker.
export const LANG_404_META_NAME = "haalarilanit-404";

// Only an explicit toggle click stores; the head script in __root sends
// returning visitors from / to their tree pre-paint.
const LANG_STORAGE_KEY = "lang";

export function storeLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Private browsing may deny storage; the choice just doesn't persist.
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

// Tree paths follow the URL; paths outside both trees use the remembered
// language (the server has no localStorage).
export function preferredLang(pathname: string): Lang {
  return isLang(pathname.split("/")[1])
    ? langFromPath(pathname)
    : (storedLang() ?? langFromPath(pathname));
}
