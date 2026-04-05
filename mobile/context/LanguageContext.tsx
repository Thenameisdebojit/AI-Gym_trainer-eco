import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import hi from "@/locales/hi.json";

export type Language = "en" | "fr" | "es" | "hi" | "de" | "pt" | "zh" | "ja" | "ko" | "ar" | "it" | "tr" | "ru" | "nl" | "pl";

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", flag: "🇮🇳" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Portuguese", nativeLabel: "português", flag: "🇧🇷" },
  { code: "zh", label: "Chinese (Traditional)", nativeLabel: "繁體中文", flag: "🇹🇼" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", flag: "🇳🇱" },
  { code: "pl", label: "Polish", nativeLabel: "Polski", flag: "🇵🇱" },
];

const TRANSLATIONS: Record<string, Record<string, string>> = { en, fr, es, hi };

export interface AppSettings {
  language: Language;
  units: "metric" | "imperial";
  difficulty: boolean;
  soundEffects: boolean;
  voiceCoach: boolean;
  notifications: boolean;
  darkMode: boolean;
  healthSync: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  units: "metric",
  difficulty: true,
  soundEffects: true,
  voiceCoach: true,
  notifications: true,
  darkMode: true,
  healthSync: false,
};

interface LanguageContextType {
  settings: AppSettings;
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "fitai_app_settings";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    });
  }, []);

  const persist = async (next: AppSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const setLanguage = useCallback((lang: Language) => {
    setSettings((prev) => {
      const next = { ...prev, language: lang };
      persist(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      persist(next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = TRANSLATIONS[settings.language] ?? TRANSLATIONS.en;
      return dict[key] ?? TRANSLATIONS.en[key] ?? key;
    },
    [settings.language]
  );

  return (
    <LanguageContext.Provider value={{ settings, language: settings.language, t, setLanguage, updateSettings }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
