import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import hi from "@/locales/hi.json";

export type Language = "en" | "fr" | "es" | "hi";

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
];

const TRANSLATIONS: Record<Language, Record<string, string>> = { en, fr, es, hi };

export interface AppSettings {
  language: Language;
  units: "metric" | "imperial";
  difficulty: "beginner" | "intermediate" | "advanced";
  voiceCoach: boolean;
  notifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  units: "metric",
  difficulty: "intermediate",
  voiceCoach: true,
  notifications: true,
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
      return (dict as Record<string, string>)[key] ?? (TRANSLATIONS.en as Record<string, string>)[key] ?? key;
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
