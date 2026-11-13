import { useTranslation as useI18nTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import { LANGUAGE_STORAGE_KEY } from "@/i18n";

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  return {
    t,
    i18n,
    language: i18n.language,
    changeLanguage: async (lng: string) => {
      await i18n.changeLanguage(lng);
      await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, lng);
    },
  };
}
