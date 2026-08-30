import { createInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import fi from "../locales/fi.json";

const i18n = createInstance();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fi: { translation: fi },
      en: { translation: en },
    },
    fallbackLng: "fi",
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
