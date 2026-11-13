import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import en from "@/locales/en";
import id from "@/locales/id";

export const LANGUAGE_STORAGE_KEY = "app_language";

const resources = {
  en: { translation: en },
  id: { translation: id },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "id",
  fallbackLng: "id",
  interpolation: {
    escapeValue: false,
  },
});

SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY).then((lng) => {
  if (lng === "en" || lng === "id") {
    void i18n.changeLanguage(lng);
  }
});

export default i18n;
