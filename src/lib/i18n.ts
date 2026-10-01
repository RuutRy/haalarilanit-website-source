import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import fi from "../locales/fi.json";
import { DEFAULT_LANG, langFromPath } from "./lang";

// URL owns language: initialize from it before first render (keeps
// hydration aligned with the prerendered HTML); RootDocument re-syncs
// it on client navigation between trees. localStorage is only written
// (by the language toggle) and read (by the root redirect sniff).
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

export default i18n;
