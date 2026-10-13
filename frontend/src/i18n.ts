import { createContext, useContext } from 'react';
import type { Language } from './types';
import { TRANSLATIONS } from './translations';

/**
 * The English text is the key: t('Explore Schemes') looks up its Hindi/Marathi version in translations.ts.
 * Anything missing falls back to English, so a new string never shows up blank.
 * Use {name} placeholders for values: t('How do I apply for {name}?', { name }).
 */
export const LanguageContext = createContext<Language>('English');

export const LANGUAGE_NAMES: Record<Language, string> = { English: 'English', Hindi: 'हिन्दी', Marathi: 'मराठी' };
export const HTML_LANG: Record<Language, string> = { English: 'en', Hindi: 'hi', Marathi: 'mr' };
const LOCALES: Record<Language, string> = { English: 'en-IN', Hindi: 'hi-IN', Marathi: 'mr-IN' };

export type Translate = (text: string, vars?: Record<string, string | number>) => string;

export function translate(lang: Language, text: string, vars?: Record<string, string | number>): string {
  const entry = lang === 'English' ? undefined : TRANSLATIONS[text];
  let out = entry ? entry[lang === 'Hindi' ? 0 : 1] : text;
  for (const [key, value] of Object.entries(vars ?? {})) out = out.replaceAll(`{${key}}`, String(value));
  return out;
}

export function useT(): Translate {
  const lang = useContext(LanguageContext);
  return (text, vars) => translate(lang, text, vars);
}

/** Shows a date like "October 13, 2026" in the reader's language; leaves anything unparseable as is. */
export function useFormatDate(): (date: string) => string {
  const lang = useContext(LanguageContext);
  return (date) => {
    const d = new Date(date);
    return Number.isNaN(d.getTime())
      ? date
      : d.toLocaleDateString(LOCALES[lang], { day: 'numeric', month: 'long', year: 'numeric' });
  };
}
