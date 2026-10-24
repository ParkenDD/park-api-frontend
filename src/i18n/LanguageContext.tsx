import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { messages, type Messages } from './messages';

export type Language = 'de' | 'en';

export const languages: Language[] = ['de', 'en'];

const STORAGE_KEY = 'language';

/**
 * The language chosen with the switcher wins. Without a choice, German is used for browsers that ask for German in any
 * of their languages, English for everybody else.
 */
function initialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'de' || stored === 'en') {
      return stored;
    }
  } catch {
    // Storage may be unavailable (private mode, blocked site data); the browser languages decide then.
  }
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  return preferred.some((language) => language?.toLowerCase().startsWith('de')) ? 'de' : 'en';
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Messages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = useCallback((value: Language) => {
    setLanguageState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // The choice then lasts for this visit only.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t: messages[language] }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage() has to be used inside <LanguageProvider>');
  }
  return value;
}

/**
 * Picks the content component of the current language, for pages whose text is too long for the message catalogue.
 */
export function Localized({ de, en }: { de: ReactNode; en: ReactNode }) {
  const { language } = useLanguage();
  return <>{language === 'de' ? de : en}</>;
}
