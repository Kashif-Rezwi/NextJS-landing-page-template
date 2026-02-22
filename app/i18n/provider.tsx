'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

type Translations = Record<string, string>;

interface I18nContextType {
  locale: string;
  t: (key: string, fallback?: string) => string;
  changeLocale: (locale: string) => Promise<void>;
  availableLocales: string[];
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  t: (key, fallback) => fallback ?? key,
  changeLocale: async () => {},
  availableLocales: ['en'],
});

export function useI18n() {
  return useContext(I18nContext);
}

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLocale?: string;
  availableLocales: string[];
}

export function LanguageProvider({ children, defaultLocale = 'en', availableLocales }: LanguageProviderProps) {
  const [locale, setLocale] = useState(defaultLocale);
  const [translations, setTranslations] = useState<Translations>({});

  const changeLocale = useCallback(async (loc: string) => {
    if (loc === defaultLocale) {
      setTranslations({});
      setLocale(loc);
      return;
    }
    try {
      const res = await fetch(`/locales/${loc}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Translations = await res.json();
      setTranslations(data);
      setLocale(loc);
    } catch (e) {
      console.warn(`[i18n] Could not load locale "${loc}":`, e);
    }
  }, [defaultLocale]);

  const t = useCallback(
    (key: string, fallback?: string) => translations[key] ?? fallback ?? key,
    [translations],
  );

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale, availableLocales }}>
      {children}
    </I18nContext.Provider>
  );
}
