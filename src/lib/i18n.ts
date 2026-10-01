import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import fi from "../locales/fi.json";
import { DEFAULT_LANG, type Lang, langFromPath } from "./lang";

// URL owns language: initialized from the path, re-synced in route beforeLoad.
const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    fi: { translation: fi },
    en: { translation: en },
  },
  lng: typeof window === "undefined" ? DEFAULT_LANG : langFromPath(window.location.pathname),
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
});

// Route beforeLoad hook: point the global language at the URL's tree.
// Links preload routes on mount (defaultPreload "render"), and preloading
// runs the target route's beforeLoad - including links into the other
// language tree. Preloading must never flip the language of the page
// being viewed, so only real navigations sync here; on full page loads
// init above already read the language from the URL.
export function syncRouteLanguage(preload: boolean, lang: Lang): void {
  if (preload) return;
  // Synchronous with bundled resources: the language is applied before
  // this returns, so the render that follows the navigation sees it.
  void i18n.changeLanguage(lang);
}

export default i18n;
