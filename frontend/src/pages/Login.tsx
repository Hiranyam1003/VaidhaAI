import React, { useContext, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { LANGUAGE_NAMES, LanguageContext, useT } from '../i18n';
import { authApi, type Account } from '../utils/authApi';
import { AuthLayout } from '../components/AuthLayout';
import { inputBoxStyle, labelStyle, primaryButtonStyle } from '../components/authStyles';
import type { Language } from '../types';

const MIN_PASSWORD_LENGTH = 8;
// Remembers that someone has used Vaidha on this device, so returning visitors see "Log in" first.
const HAS_ACCOUNT_KEY = 'vaidha_has_account';

const hasAccountHere = () => {
  try {
    return localStorage.getItem(HAS_ACCOUNT_KEY) === '1';
  } catch {
    return false;
  }
};

interface LoginProps {
  onLanguageChange: (language: Language) => void;
  onLoggedIn: (account: Account) => void;
}

// Register on first visit, log in afterwards. Mobile number + password, stored only in Vaidha's own database.
export const Login: React.FC<LoginProps> = ({ onLanguageChange, onLoggedIn }) => {
  const t = useT();
  const language = useContext(LanguageContext);
  const [mode, setMode] = useState<'register' | 'login'>(hasAccountHere() ? 'login' : 'register');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const registering = mode === 'register';
  const mismatch = registering && confirm.length > 0 && confirm !== password;
  const incomplete =
    phone.length !== 10 ||
    (registering ? password.length < MIN_PASSWORD_LENGTH || confirm !== password : password.length === 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = registering ? await authApi.register(phone, password, language) : await authApi.login(phone, password, language);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    try {
      localStorage.setItem(HAS_ACCOUNT_KEY, '1');
    } catch {
      // Storage can be blocked; this only decides which tab shows first next time.
    }
    onLoggedIn(result.data);
  };

  const switchMode = () => {
    setMode(registering ? 'login' : 'register');
    setError(null);
    setConfirm('');
  };

  const passwordField = (id: string, label: string, value: string, onChange: (v: string) => void, autoComplete: string) => (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        required
        maxLength={128}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputBoxStyle, width: '100%', padding: '0 14px', fontSize: '16px' }}
      />
    </div>
  );

  return (
    <AuthLayout>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '22px' }} role="group" aria-label={t('Language')}>
        {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => onLanguageChange(lang)}
            aria-pressed={language === lang}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 500,
              border: `1px solid ${language === lang ? 'var(--brand-sun)' : 'var(--workspace-border)'}`,
              backgroundColor: language === lang ? 'var(--brand-sun-light)' : '#ffffff',
              color: language === lang ? 'var(--brand-sun)' : 'var(--workspace-text-main)',
            }}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>

      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: '6px' }}>
        {registering ? t('Create your Vaidha AI account') : t('Log in to Vaidha AI')}
      </h1>
      <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)', textAlign: 'center', marginBottom: '24px', lineHeight: 1.5 }}>
        {registering
          ? t('Register once with your mobile number and a password. Your account is saved on this Vaidha server only.')
          : t('Enter the mobile number and password you registered with.')}
      </p>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label htmlFor="login-phone" style={labelStyle}>
            {t('Mobile number')}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', ...inputBoxStyle }}>
            <span style={{ padding: '0 10px 0 14px', color: 'var(--workspace-text-muted)', fontSize: '16px', borderRight: '1px solid var(--workspace-border)' }}>+91</span>
            <input
              id="login-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="username"
              maxLength={10}
              required
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              style={{ flex: 1, height: '100%', padding: '0 12px', fontSize: '17px', letterSpacing: '0.04em', background: 'transparent' }}
            />
          </div>
        </div>

        {passwordField('login-password', t('Password'), password, setPassword, registering ? 'new-password' : 'current-password')}
        {registering && (
          <p style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', marginTop: '-8px' }}>
            {t('At least 8 characters.')}
          </p>
        )}
        {registering && passwordField('login-confirm', t('Confirm password'), confirm, setConfirm, 'new-password')}
        {mismatch && <p style={{ fontSize: '12.5px', color: '#b42318', marginTop: '-8px' }}>{t('The passwords do not match.')}</p>}

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--workspace-text-main)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            style={{ width: '17px', height: '17px', accentColor: 'var(--brand-sun)' }}
          />
          {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
          {t('Show password')}
        </label>

        {error && (
          <p role="alert" style={{ fontSize: '13px', color: '#b42318', backgroundColor: '#fef3f2', borderRadius: '8px', padding: '10px 12px' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || incomplete} style={primaryButtonStyle(busy || incomplete)}>
          {busy && <Loader2 size={16} className="spin" />}
          {registering ? t('Register') : t('Log in')}
        </button>

        <p style={{ fontSize: '13px', color: 'var(--workspace-text-muted)', textAlign: 'center' }}>
          {registering ? t('Already registered?') : t('New to Vaidha AI?')}{' '}
          <button type="button" onClick={switchMode} style={{ color: 'var(--brand-sun)', fontWeight: 600 }}>
            {registering ? t('Log in') : t('Register')}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};
