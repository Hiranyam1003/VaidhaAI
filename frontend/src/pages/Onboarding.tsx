import React, { useContext, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { LANGUAGE_NAMES, LanguageContext, useT } from '../i18n';
import { AuthLayout } from '../components/AuthLayout';
import { inputBoxStyle, labelStyle, primaryButtonStyle } from '../components/authStyles';
import { authApi, type Account, type AccountDetails } from '../utils/authApi';
import type { Language } from '../types';

const STATES = ['Maharashtra', 'Delhi NCR', 'Karnataka', 'Uttar Pradesh', 'Gujarat', 'Another state'];
const GENDERS: AccountDetails['gender'][] = ['Female', 'Male', 'Other'];

const fieldStyle: React.CSSProperties = { ...inputBoxStyle, width: '100%', padding: '0 12px', fontSize: '15px' };

interface OnboardingProps {
  account: Account;
  onLanguageChange: (language: Language) => void;
  onDone: (account: Account) => void;
}

// Shown once, right after the first login, to collect the person's basic details and preferred language.
export const Onboarding: React.FC<OnboardingProps> = ({ account, onLanguageChange, onDone }) => {
  const t = useT();
  const language = useContext(LanguageContext);
  const [name, setName] = useState(account.details.name ?? '');
  const [gender, setGender] = useState<AccountDetails['gender']>(account.details.gender ?? 'Female');
  const [age, setAge] = useState(account.details.age ? String(account.details.age) : '');
  const [state, setState] = useState(account.details.state ?? 'Maharashtra');
  const [district, setDistrict] = useState(account.details.district ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await authApi.saveDetails(
      { name: name.trim(), gender, age: Number(age), state, district: district.trim(), language },
      language,
    );
    setBusy(false);
    if (result.ok) onDone(result.data);
    else setError(result.error);
  };

  const incomplete = !name.trim() || !age || Number(age) < 1 || Number(age) > 120;

  return (
    <AuthLayout>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: '6px' }}>
        {t('Tell us about yourself')}
      </h1>
      <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)', textAlign: 'center', marginBottom: '22px', lineHeight: 1.5 }}>
        {t('This helps Vaidha suggest the right schemes for you. It takes less than a minute.')}
      </p>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="ob-name" style={labelStyle}>
            {t('Full Name')}
          </label>
          <input id="ob-name" required autoFocus autoComplete="name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="ob-gender" style={labelStyle}>
              {t('Gender')}
            </label>
            <select id="ob-gender" value={gender} onChange={(e) => setGender(e.target.value as AccountDetails['gender'])} style={fieldStyle}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {t(g)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ob-age" style={labelStyle}>
              {t('Age')}
            </label>
            <input
              id="ob-age"
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              required
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
              style={fieldStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="ob-state" style={labelStyle}>
              {t('State')}
            </label>
            <select id="ob-state" value={state} onChange={(e) => setState(e.target.value)} style={fieldStyle}>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {t(s)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ob-district" style={labelStyle}>
              {t('District')}
            </label>
            <input id="ob-district" maxLength={60} value={district} onChange={(e) => setDistrict(e.target.value)} style={fieldStyle} />
          </div>
        </div>

        <fieldset style={{ border: 'none' }}>
          <legend style={labelStyle}>{t('Preferred language')}</legend>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                aria-pressed={language === lang}
                style={{
                  height: '46px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  border: `1px solid ${language === lang ? 'var(--brand-sun)' : 'var(--workspace-border)'}`,
                  backgroundColor: language === lang ? 'var(--brand-sun-light)' : '#ffffff',
                  color: language === lang ? 'var(--brand-sun)' : 'var(--workspace-text-main)',
                }}
              >
                {language === lang && <Check size={15} aria-hidden="true" />}
                {LANGUAGE_NAMES[lang]}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', marginTop: '8px' }}>
            {t('You can change this later in Settings.')}
          </p>
        </fieldset>

        {error && (
          <p role="alert" style={{ fontSize: '13px', color: '#b42318', backgroundColor: '#fef3f2', borderRadius: '8px', padding: '10px 12px' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || incomplete} style={primaryButtonStyle(busy || incomplete)}>
          {busy && <Loader2 size={16} className="spin" />}
          {t('Save and continue')}
        </button>
      </form>
    </AuthLayout>
  );
};
