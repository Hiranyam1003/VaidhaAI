import { translate } from '../i18n';
import type { Language } from '../types';

// Mirrors EligibilityProfile / EligibilityReply in backend/main.py.
export interface EligibilityProfile {
  state: 'Maharashtra' | 'Delhi' | 'Karnataka' | 'Uttar Pradesh' | 'Gujarat' | 'Other';
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  income: 'below-1l' | '1l-3l' | '3l-6l' | '6l-8l' | '8l-18l' | 'above-18l';
  category: 'General' | 'EWS' | 'OBC' | 'SC' | 'ST' | 'VJNT/SBC';
  occupation:
    | 'student'
    | 'farmer'
    | 'farm-labourer'
    | 'artisan'
    | 'street-vendor'
    | 'daily-wage'
    | 'small-business'
    | 'salaried'
    | 'homemaker'
    | 'unemployed'
    | 'retired';
  ownsFarmland: boolean;
  ownsPuccaHouse: boolean;
  hasDisability: boolean;
  pregnantOrNewMother: boolean;
  paysIncomeTax: boolean;
}

export interface SchemeVerdict {
  schemeId: string;
  verdict: 'likely' | 'maybe' | 'unlikely';
  reason: string;
  toConfirm: string[];
  papers: string[];
  documentIds: string[];
  steps: string[];
}

export interface EligibilityReply {
  summary: string;
  results: SchemeVerdict[];
}

export type EligibilityResult = { ok: true; reply: EligibilityReply } | { ok: false; error: string };

// Asks the backend which schemes fit this profile. The backend retrieves the closest schemes and document
// guides (RAG) and has Gemini judge each one. Never throws: failures come back as a translated message.
export async function checkEligibility(profile: EligibilityProfile, language: Language): Promise<EligibilityResult> {
  const fail = (text: string): EligibilityResult => ({ ok: false, error: translate(language, text) });
  try {
    const res = await fetch('/api/eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, language }),
    });
    if (res.ok) return { ok: true, reply: await res.json() };

    const body = await res.json().catch(() => null);
    // No JSON body means the request never reached FastAPI (the dev proxy answers 502 when it is down).
    if (!body) return fail('Could not reach the Vaidha AI server. Make sure the backend is running.');
    console.warn('Vaidha AI eligibility error:', res.status, body.detail);
    if (res.status === 429) return fail("You're checking too quickly. Please wait a minute and try again.");
    if (res.status === 503) return fail('Vaidha AI is very busy right now. Please try again in a minute.');
    return fail('Vaidha AI could not check your eligibility right now. Please try again in a moment.');
  } catch {
    return fail('Could not reach the Vaidha AI server. Make sure the backend is running.');
  }
}
