import React from 'react';
import { Check } from 'lucide-react';
import { TEXT_SIZE_SCALE } from '../utils/textSize';
import type { Language, TextSize } from '../types';
import { useT } from '../i18n';

const TEXT_SIZE_OPTIONS: { id: TextSize; label: string }[] = [
  { id: 'normal', label: 'Default' },
  { id: 'large', label: 'Large' },
  { id: 'larger', label: 'Extra large' },
];

const LANGUAGE_OPTIONS: { id: Language; label: string }[] = [
  { id: 'English', label: 'English' },
  { id: 'Hindi', label: 'हिन्दी (Hindi)' },
  { id: 'Marathi', label: 'मराठी (Marathi)' },
];

interface SettingsProps {
  textSize: TextSize;
  onChangeTextSize: (size: TextSize) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
}

export const Settings: React.FC<SettingsProps> = ({ textSize, onChangeTextSize, language, onChangeLanguage }) => {
  const t = useT();
  return (
  <div
    style={{
      flex: 1,
      height: '100%',
      overflowY: 'auto',
      padding: '32px 28px 60px 28px',
      maxWidth: '780px',
      margin: '0 auto',
      width: '100%',
    }}
    className="fade-in"
  >
    <div style={{ marginBottom: '22px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '25px',
          fontWeight: 700,
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
          marginBottom: '6px',
        }}
      >
        {t('Settings')}
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)' }}>
        {t('Make Vaidha AI easier to read and use. Changes are saved on this device.')}
      </p>
    </div>

    <Section title={t('Text size')} description={t('Makes all text and buttons bigger across the app.')}>
      {TEXT_SIZE_OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          selected={textSize === option.id}
          onClick={() => onChangeTextSize(option.id)}
        >
          <span style={{ fontSize: `${14 * TEXT_SIZE_SCALE[option.id]}px`, fontWeight: 600 }}>Aa</span>
          <span>{t(option.label)}</span>
        </OptionButton>
      ))}
    </Section>

    <Section title={t('Language')} description={t('The language for the whole website and Vaidha AI’s answers.')}>
      {LANGUAGE_OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          selected={language === option.id}
          onClick={() => onChangeLanguage(option.id)}
        >
          <span>{option.label}</span>
        </OptionButton>
      ))}
    </Section>
  </div>
  );
};

const Section: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <section
    aria-label={title}
    style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--workspace-border)',
      borderRadius: '16px',
      padding: '22px 24px',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '16px',
    }}
  >
    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>{title}</h3>
    <p style={{ fontSize: '13px', color: 'var(--workspace-text-muted)', marginBottom: '16px' }}>{description}</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>{children}</div>
  </section>
);

const OptionButton: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({
  selected,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    aria-pressed={selected}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minHeight: '44px',
      padding: '8px 16px',
      borderRadius: '10px',
      fontSize: '13.5px',
      fontWeight: 500,
      color: selected ? 'var(--brand-sun)' : 'var(--workspace-text-main)',
      backgroundColor: selected ? 'var(--brand-sun-light)' : '#ffffff',
      border: selected ? '1px solid var(--brand-sun)' : '1px solid var(--workspace-border)',
      transition: 'all 0.12s ease',
    }}
  >
    {children}
    {selected && <Check size={15} />}
  </button>
);
