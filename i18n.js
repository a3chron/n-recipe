import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import esPE from "./locales/es-PE.json";
import it from "./locales/it.json";
import sk from "./locales/sk.json";

const locales = Localization.getLocales();
const localeCode =
  locales && locales.length > 0 ? locales[0].languageTag : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: localeCode,
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    de: { translation: de },
    "es-PE": { translation: esPE },
    it: { translation: it },
    sk: { translation: sk },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
