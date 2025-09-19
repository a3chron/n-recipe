import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de/en.json";
import esPE from "./locales/en-PE/en.json";
import en from "./locales/en.json";
import it from "./locales/it/en.json";
import sk from "./locales/sk/en.json";

// Safely get locale code, defaulting to 'en'
const locales = Localization.getLocales();
const localeCode =
  locales && locales.length > 0 ? locales[0].languageCode : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: localeCode,
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: esPE },
    it: { translation: it },
    sk: { translation: sk },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
