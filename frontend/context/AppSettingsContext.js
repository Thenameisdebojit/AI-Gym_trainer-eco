'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TRANSLATIONS = {
  en: {
    training: 'Training', discover: 'Discover', report: 'Report', settings: 'Settings',
    trainingSub: 'Your personalized training hub',
    discoverSub: 'Explore workouts and exercises',
    reportSub: 'Track your fitness progress',
    settingsSub: 'App preferences and profile',
  },
  es: {
    training: 'Entrenamiento', discover: 'Descubrir', report: 'Informe', settings: 'Ajustes',
    trainingSub: 'Tu centro de entrenamiento personalizado',
    discoverSub: 'Explora ejercicios y rutinas',
    reportSub: 'Sigue tu progreso físico',
    settingsSub: 'Preferencias y perfil',
  },
  fr: {
    training: 'Entraînement', discover: 'Découvrir', report: 'Rapport', settings: 'Paramètres',
    trainingSub: 'Votre centre d\'entraînement personnalisé',
    discoverSub: 'Explorez exercices et séances',
    reportSub: 'Suivez votre progression',
    settingsSub: 'Préférences et profil',
  },
  de: {
    training: 'Training', discover: 'Entdecken', report: 'Bericht', settings: 'Einstellungen',
    trainingSub: 'Dein persönliches Trainingszentrum',
    discoverSub: 'Übungen und Workouts entdecken',
    reportSub: 'Deinen Fortschritt verfolgen',
    settingsSub: 'App-Einstellungen und Profil',
  },
  hi: {
    training: 'प्रशिक्षण', discover: 'खोजें', report: 'रिपोर्ट', settings: 'सेटिंग्स',
    trainingSub: 'आपका व्यक्तिगत प्रशिक्षण केंद्र',
    discoverSub: 'वर्कआउट और व्यायाम खोजें',
    reportSub: 'अपनी फिटनेस प्रगति ट्रैक करें',
    settingsSub: 'ऐप प्राथमिकताएं और प्रोफाइल',
  },
  pt: {
    training: 'Treino', discover: 'Descobrir', report: 'Relatório', settings: 'Configurações',
    trainingSub: 'Seu centro de treino personalizado',
    discoverSub: 'Explore exercícios e treinos',
    reportSub: 'Acompanhe seu progresso fitness',
    settingsSub: 'Preferências e perfil do app',
  },
};

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [darkMode, setDarkModeState] = useState(false);
  const [language, setLanguageState] = useState('en');
  const [notifications, setNotificationsState] = useState(false);
  const [healthSync, setHealthSyncState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const dm = localStorage.getItem('fitai_darkMode');
      const lang = localStorage.getItem('fitai_language');
      const notif = localStorage.getItem('fitai_notifications');
      const hs = localStorage.getItem('fitai_healthSync');
      if (dm !== null) setDarkModeState(dm === 'true');
      if (lang) setLanguageState(lang);
      if (notif !== null) setNotificationsState(notif === 'true');
      if (hs !== null) setHealthSyncState(hs === 'true');
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem('fitai_darkMode', String(darkMode)); } catch {}
  }, [darkMode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('fitai_language', language); } catch {}
  }, [language, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('fitai_notifications', String(notifications)); } catch {}
  }, [notifications, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('fitai_healthSync', String(healthSync)); } catch {}
  }, [healthSync, hydrated]);

  const setDarkMode = useCallback((val) => setDarkModeState(val), []);
  const setLanguage = useCallback((val) => setLanguageState(val), []);
  const setHealthSync = useCallback((val) => setHealthSyncState(val), []);

  const setNotifications = useCallback(async (val) => {
    if (val && typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('FitAI', { body: 'Notifications enabled! Time to work out! 💪', icon: '/favicon.ico' });
        setNotificationsState(true);
      } else {
        setNotificationsState(false);
      }
    } else {
      setNotificationsState(val);
    }
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppSettingsContext.Provider value={{
      darkMode, setDarkMode,
      language, setLanguage,
      notifications, setNotifications,
      healthSync, setHealthSync,
      t,
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}

export { TRANSLATIONS };
