import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useT, type StringKey } from '../i18n';

const STATE_OPTIONS: StringKey[] = [
  'state.Maharashtra',
  'state.Delhi NCR',
  'state.Karnataka',
  'state.Uttar Pradesh',
  'state.Gujarat',
  'state.All India',
];
const INCOME_OPTIONS: StringKey[] = ['income.bpl', 'income.ews', 'income.lig', 'income.ebc', 'income.mig'];
const CATEGORY_OPTIONS: StringKey[] = ['social.general', 'social.ews', 'social.obc', 'social.scst', 'social.vjnt'];
const OCCUPATION_OPTIONS: StringKey[] = [
  'occupation.student',
  'occupation.farmer',
  'occupation.artisan',
  'occupation.labourer',
  'occupation.salaried',
];

interface EligibilityCheckerProps {
  onCheckCriteria: (prompt: string) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onCheckCriteria }) => {
  const t = useT();
  const [state, setState] = useState<StringKey>('state.Maharashtra');
  const [incomeRange, setIncomeRange] = useState<StringKey>('income.ews');
  const [category, setCategory] = useState<StringKey>('social.general');
  const [occupation, setOccupation] = useState<StringKey>('occupation.student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckCriteria(
      t('prompt.eligibility', {
        state: t(state),
        income: t(incomeRange),
        category: t(category),
        occupation: t(occupation),
      }),
    );
  };

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '32px 24px 60px 24px',
        maxWidth: '720px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>
          {t('elig.title')}
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)' }}>{t('elig.subtitle')}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--workspace-border)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <SelectField id="elig-state" label={t('elig.state')} value={state} options={STATE_OPTIONS} onChange={setState} />
        <SelectField id="elig-income" label={t('elig.income')} value={incomeRange} options={INCOME_OPTIONS} onChange={setIncomeRange} />
        <SelectField id="elig-category" label={t('elig.category')} value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />
        <SelectField
          id="elig-occupation"
          label={t('elig.occupation')}
          value={occupation}
          options={OCCUPATION_OPTIONS}
          onChange={setOccupation}
        />

        <button
          type="submit"
          style={{
            marginTop: '8px',
            height: '44px',
            borderRadius: '9px',
            backgroundColor: 'var(--brand-sun)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(217, 72, 43, 0.3)',
          }}
        >
          <span>{t('elig.submit')}</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
};

interface SelectFieldProps {
  id: string;
  label: string;
  value: StringKey;
  options: StringKey[];
  onChange: (value: StringKey) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, value, options, onChange }) => {
  const t = useT();
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as StringKey)}
        style={{
          width: '100%',
          height: '40px',
          borderRadius: '8px',
          border: '1px solid var(--workspace-border)',
          padding: '0 12px',
          fontSize: '13.5px',
          backgroundColor: '#faf8f5',
          color: 'var(--workspace-text-main)',
        }}
      >
        {options.map((key) => (
          <option key={key} value={key}>
            {t(key)}
          </option>
        ))}
      </select>
    </div>
  );
};
