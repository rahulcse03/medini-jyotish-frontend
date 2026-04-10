import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English',  native: 'English' },
  { code: 'hi', label: 'Hindi',    native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil',    native: 'தமிழ்' },
  { code: 'te', label: 'Telugu',   native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada',  native: 'ಕನ್ನಡ' },
  { code: 'bn', label: 'Bengali',  native: 'বাংলা' },
  { code: 'mr', label: 'Marathi',  native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

const STORAGE_KEY = 'medini-lang';

function getSavedLang() {
  try { return localStorage.getItem(STORAGE_KEY) || 'en'; }
  catch { return 'en'; }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getSavedLang);

  const setLang = useCallback((code) => {
    setLangState(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  }, []);

  const t = useCallback((key) => {
    const langMap = translations[lang] || translations['en'];
    return langMap[key] ?? translations['en'][key] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
