import { translate } from '../i18n';
import type { Language } from '../types';

// Mirrors Account / AccountDetails in backend/auth.py. The session itself is an HttpOnly cookie.
export interface AccountDetails {
  name: string;
  gender: 'Female' | 'Male' | 'Other';
  age: number;
  state: string;
  district: string;
  language: Language;
}

export interface Account {
  phone: string;
  details: Partial<AccountDetails>;
  needsDetails: boolean;
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const SERVER_DOWN = 'Could not reach the Vaidha AI server. Make sure the backend is running.';

// Never throws. Backend messages are plain English sentences, so known ones are shown translated.
async function call<T>(path: string, language: Language, init?: RequestInit): Promise<Result<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    });
    const body = await res.json().catch(() => null);
    if (res.ok) return { ok: true, data: body as T };
    if (!body) return { ok: false, error: translate(language, SERVER_DOWN) };
    const detail = typeof body.detail === 'string' ? body.detail : 'Please check the details and try again.';
    return { ok: false, error: translate(language, detail) };
  } catch {
    return { ok: false, error: translate(language, SERVER_DOWN) };
  }
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) });

export const authApi = {
  me: (language: Language) => call<Account | null>('/auth/me', language),
  register: (phone: string, password: string, language: Language) =>
    call<Account>('/auth/register', language, json('POST', { phone, password })),
  login: (phone: string, password: string, language: Language) =>
    call<Account>('/auth/login', language, json('POST', { phone, password })),
  saveDetails: (details: AccountDetails, language: Language) => call<Account>('/account', language, json('PUT', details)),
  updateDetails: (changes: Partial<AccountDetails>, language: Language) =>
    call<Account>('/account', language, json('PATCH', changes)),
  logout: (language: Language) => call<{ ok: boolean }>('/auth/logout', language, { method: 'POST' }),
};
