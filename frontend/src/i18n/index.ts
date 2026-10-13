import { createContext, useContext } from 'react';
import type { Language } from '../types';
import { STRINGS, type StringKey } from './strings';

export type { StringKey };

export const LanguageContext = createContext<Language>('English');

export const LANGUAGE_NAMES: Record<Language, string> = {
  English: 'English',
  Hindi: 'हिन्दी',
  Marathi: 'मराठी',
};

export function translate(lang: Language, key: StringKey, vars?: Record<string, string | number>): string {
  const text = STRINGS[lang][key];
  return vars ? text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match)) : text;
}

export function useLanguage(): Language {
  return useContext(LanguageContext);
}

export function useT() {
  const lang = useContext(LanguageContext);
  return (key: StringKey, vars?: Record<string, string | number>) => translate(lang, key, vars);
}
