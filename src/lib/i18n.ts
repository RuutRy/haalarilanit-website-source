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

// Called from route beforeLoad. Preload also runs beforeLoad (defaultPreload
// "render") and must never flip the viewed page's language, so only real
// navigations sync here.
export function syncRouteLanguage(preload: boolean, lang: Lang): void {
  if (preload) return;
  // Synchronous with bundled resources: the next render sees the new language.
  void i18n.changeLanguage(lang);
}

export default i18n;
