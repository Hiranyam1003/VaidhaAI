import React, { useContext, useState } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, FileText, Loader2, Search, Sparkles } from 'lucide-react';
import { LanguageContext, useT } from '../i18n';
import { localizeDocuments } from '../data/documentTranslations';
import type { SchemeItem } from '../data/schemes';
import type { UserProfile } from '../types';
import {
  checkEligibility,
  type EligibilityProfile,
  type EligibilityReply,
  type SchemeVerdict,
} from '../utils/eligibilityApi';

export interface EligibilitySession {
  profile: EligibilityProfile;
  reply: EligibilityReply;
}

const STATES: [EligibilityProfile['state'], string][] = [
  ['Maharashtra', 'Maharashtra'],
  ['Delhi', 'Delhi NCR'],
  ['Karnataka', 'Karnataka'],
  ['Uttar Pradesh', 'Uttar Pradesh'],
  ['Gujarat', 'Gujarat'],
  ['Other', 'Another state'],
];
const INCOMES: [EligibilityProfile['income'], string][] = [
  ['below-1l', 'Less than ₹1 Lakh (BPL / Antyodaya)'],
  ['1l-3l', '₹1 Lakh – ₹3 Lakhs (Economically Weaker Section)'],
  ['3l-6l', '₹3 Lakhs – ₹6 Lakhs (Low Income Group)'],
  ['6l-8l', '₹6 Lakhs – ₹8 Lakhs (EBC Fee-Waiver Limit)'],
  ['8l-18l', '₹8 Lakhs – ₹18 Lakhs (Middle Income Group)'],
  ['above-18l', 'More than ₹18 Lakhs'],
];
const CATEGORIES: [EligibilityProfile['category'], string][] = [
  ['General', 'General / Open'],
  ['EWS', 'EWS (Economically Weaker Section)'],
  ['OBC', 'OBC (Non-Creamy Layer)'],
  ['SC', 'Scheduled Caste (SC)'],
  ['ST', 'Scheduled Tribe (ST)'],
  ['VJNT/SBC', 'VJNT / SBC (State Specific)'],
];
const OCCUPATIONS: [EligibilityProfile['occupation'], string][] = [
  ['student', 'Student'],
  ['farmer', 'Farmer'],
  ['farm-labourer', 'Farm labourer'],
  ['artisan', 'Artisan / Traditional Craftsman'],
  ['street-vendor', 'Street vendor'],
  ['daily-wage', 'Daily Wage / Unorganized Laborer'],
  ['small-business', 'Small business owner'],
  ['salaried', 'Salaried / Private Employee'],
  ['homemaker', 'Homemaker'],
  ['unemployed', 'Looking for work'],
  ['retired', 'Retired'],
];
const GENDERS: [EligibilityProfile['gender'], string][] = [
  ['Female', 'Female'],
  ['Male', 'Male'],
  ['Other', 'Other'],
];
type YesNoKey = 'ownsFarmland' | 'ownsPuccaHouse' | 'paysIncomeTax' | 'hasDisability' | 'pregnantOrNewMother';
const YES_NO_QUESTIONS: [YesNoKey, string][] = [
  ['ownsFarmland', 'I own farmland'],
  ['ownsPuccaHouse', 'I already own a pucca (permanent) house'],
  ['paysIncomeTax', 'Someone in my family pays income tax'],
  ['hasDisability', 'I have a disability'],
  ['pregnantOrNewMother', 'I am pregnant or a new mother'],
];

// Starts the form from My Profile where the answers overlap.
function profileDefaults(p: UserProfile): EligibilityProfile {
  const state = STATES.find(([value, label]) => p.state === value || p.state === label)?.[0] ?? 'Other';
  const category = p.category.startsWith('EWS') ? 'EWS' : p.category.startsWith('OBC') ? 'OBC' : p.category.startsWith('SC') ? 'SC' : 'General';
  const incomeMap: Record<string, EligibilityProfile['income']> = {
    '< 1 Lakh (BPL)': 'below-1l',
    '< 3 Lakhs (EWS)': '1l-3l',
    '3L - 6L (LIG)': '3l-6l',
    '₹6 Lakh – ₹8 Lakh (EBC)': '6l-8l',
    '8L - 18L (MIG)': '8l-18l',
  };
  return {
    state,
    age: 30,
    gender: 'Female',
    income: incomeMap[p.incomeRange] ?? '1l-3l',
    category,
    occupation: 'salaried',
    ownsFarmland: false,
    ownsPuccaHouse: false,
    hasDisability: false,
    pregnantOrNewMother: false,
    paysIncomeTax: false,
  };
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  borderRadius: '8px',
  border: '1px solid var(--workspace-border)',
  padding: '0 12px',
  fontSize: '13.5px',
  backgroundColor: '#faf8f5',
  color: 'var(--workspace-text-main)',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' };

interface EligibilityCheckerProps {
  schemes: SchemeItem[];
  userProfile: UserProfile;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onAsk: (question: string) => void;
  onOpenDocument: (id: string) => void;
  session: EligibilitySession | null;
  onSession: (session: EligibilitySession | null) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  schemes,
  userProfile,
  savedIds,
  onToggleSave,
  onAsk,
  onOpenDocument,
  session,
  onSession,
}) => {
  const t = useT();
  const language = useContext(LanguageContext);
  const [profile, setProfile] = useState<EligibilityProfile>(session?.profile ?? profileDefaults(userProfile));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof EligibilityProfile>(key: K, value: EligibilityProfile[K]) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await checkEligibility(
      { ...profile, pregnantOrNewMother: profile.gender === 'Female' && profile.pregnantOrNewMother },
      language,
    );
    setLoading(false);
    if (result.ok) onSession({ profile, reply: result.reply });
    else setError(result.error);
  };

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '32px 24px 60px 24px',
        maxWidth: '820px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>
          {t('Interactive Eligibility Checker')}
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)' }}>
          {t('Answer a few questions. Vaidha searches its scheme and document library and tells you which schemes fit you and how to apply.')}
        </p>
      </div>

      {session ? (
        <Results
          session={session}
          schemes={schemes}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onAsk={onAsk}
          onOpenDocument={onOpenDocument}
          onEdit={() => onSession(null)}
        />
      ) : (
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '16px' }}>
            <Select id="elig-state" label={t('State / Union Territory')} value={profile.state} options={STATES} onChange={(v) => set('state', v)} />
            <div>
              <label htmlFor="elig-age" style={labelStyle}>
                {t('Age')}
              </label>
              <input
                id="elig-age"
                type="number"
                min={0}
                max={120}
                required
                value={profile.age}
                onChange={(e) => set('age', Math.max(0, Math.min(120, Number(e.target.value) || 0)))}
                style={fieldStyle}
              />
            </div>
            <Select id="elig-gender" label={t('Gender')} value={profile.gender} options={GENDERS} onChange={(v) => set('gender', v)} />
            <Select id="elig-income" label={t('Annual Family Income')} value={profile.income} options={INCOMES} onChange={(v) => set('income', v)} />
            <Select id="elig-category" label={t('Social Category')} value={profile.category} options={CATEGORIES} onChange={(v) => set('category', v)} />
            <Select
              id="elig-occupation"
              label={t('Occupation / Primary Focus')}
              value={profile.occupation}
              options={OCCUPATIONS}
              onChange={(v) => set('occupation', v)}
            />
          </div>

          <fieldset style={{ border: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <legend style={{ ...labelStyle, marginBottom: '10px' }}>{t('Tick what is true for you')}</legend>
            {YES_NO_QUESTIONS.filter(([key]) => key !== 'pregnantOrNewMother' || profile.gender === 'Female').map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--workspace-text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={profile[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-sun)' }}
                />
                {t(label)}
              </label>
            ))}
          </fieldset>

          {error && (
            <p role="alert" style={{ fontSize: '13px', color: '#b42318', backgroundColor: '#fef3f2', borderRadius: '8px', padding: '10px 12px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '4px',
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
              opacity: loading ? 0.8 : 1,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
            <span>{loading ? t('Checking the scheme library…') : t('Find schemes for me')}</span>
          </button>
        </form>
      )}
    </div>
  );
};

function Select<V extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: V;
  options: [V, string][];
  onChange: (value: V) => void;
}) {
  const t = useT();
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as V)} style={fieldStyle}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {t(optionLabel)}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ResultsProps {
  session: EligibilitySession;
  schemes: SchemeItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onAsk: (question: string) => void;
  onOpenDocument: (id: string) => void;
  onEdit: () => void;
}

const Results: React.FC<ResultsProps> = ({ session, schemes, savedIds, onToggleSave, onAsk, onOpenDocument, onEdit }) => {
  const t = useT();
  const { results, summary } = session.reply;
  const groups: [SchemeVerdict['verdict'], string][] = [
    ['likely', 'Likely eligible'],
    ['maybe', 'You might be eligible'],
  ];
  const unlikely = results.filter((r) => r.verdict === 'unlikely');

  const card = (r: SchemeVerdict) => {
    const scheme = schemes.find((s) => s.id === r.schemeId);
    return scheme ? (
      <ResultCard
        key={r.schemeId}
        result={r}
        scheme={scheme}
        saved={savedIds.includes(scheme.id)}
        onToggleSave={() => onToggleSave(scheme.id)}
        onAsk={onAsk}
        onOpenDocument={onOpenDocument}
      />
    ) : null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div
        style={{
          backgroundColor: 'var(--brand-sun-light)',
          border: '1px solid var(--brand-sun-border)',
          borderRadius: '14px',
          padding: '16px 18px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Sparkles size={18} color="var(--brand-sun)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', color: '#1a1a1a', lineHeight: 1.55 }}>{summary}</p>
          <button
            onClick={onEdit}
            style={{ marginTop: '10px', fontSize: '12.5px', fontWeight: 600, color: 'var(--brand-sun)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ArrowLeft size={13} /> {t('Change my answers')}
          </button>
        </div>
      </div>

      {groups.map(([verdict, title]) => {
        const items = results.filter((r) => r.verdict === verdict);
        return items.length === 0 ? null : (
          <section key={verdict} aria-label={t(title)}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>
              {t(title)} ({items.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>{items.map(card)}</div>
          </section>
        );
      })}

      {results.every((r) => r.verdict === 'unlikely') && (
        <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)' }}>
          {t('No scheme in the library is a clear match yet. Try changing your answers, or ask Vaidha in the chat.')}
        </p>
      )}

      {unlikely.length > 0 && (
        <details>
          <summary style={{ cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: 'var(--workspace-text-muted)' }}>
            {t('Probably not eligible')} ({unlikely.length})
          </summary>
          <ul style={{ listStyle: 'none', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unlikely.map((r) => {
              const scheme = schemes.find((s) => s.id === r.schemeId);
              return scheme ? (
                <li key={r.schemeId} style={{ fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: 1.5 }}>
                  <strong>{scheme.name}</strong>: {r.reason}
                </li>
              ) : null;
            })}
          </ul>
        </details>
      )}

      <p style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', lineHeight: 1.5 }}>
        {t('These results are AI-assisted and based on Vaidha’s scheme library. Always confirm on the official website before applying.')}
      </p>
    </div>
  );
};

interface ResultCardProps {
  result: SchemeVerdict;
  scheme: SchemeItem;
  saved: boolean;
  onToggleSave: () => void;
  onAsk: (question: string) => void;
  onOpenDocument: (id: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, scheme, saved, onToggleSave, onAsk, onOpenDocument }) => {
  const t = useT();
  const documents = localizeDocuments(useContext(LanguageContext));
  const likely = result.verdict === 'likely';
  const applyUrl = scheme.officialApplicationUrl || scheme.officialSourceUrl;

  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--workspace-border)',
        borderLeft: `4px solid ${likely ? '#16a34a' : '#d97706'}`,
        borderRadius: '14px',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: likely ? '#15803d' : '#b45309',
              backgroundColor: likely ? '#f0fdf4' : '#fffbeb',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {t(likely ? 'Likely eligible' : 'You might be eligible')}
          </span>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.35, margin: '8px 0 2px' }}>{scheme.name}</h4>
          {(scheme.regionalName || scheme.hindiName) && (
            <p style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)' }}>{scheme.regionalName || scheme.hindiName}</p>
          )}
        </div>
        <button
          onClick={onToggleSave}
          title={saved ? t('Remove bookmark') : t('Save scheme')}
          aria-label={saved ? t('Remove bookmark') : t('Save scheme')}
          aria-pressed={saved}
          style={{ color: saved ? 'var(--brand-sun)' : 'var(--workspace-text-subtle)', padding: '4px', flexShrink: 0 }}
        >
          {saved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
        </button>
      </div>

      <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-main)', lineHeight: 1.55, margin: '10px 0' }}>{result.reason}</p>

      {result.toConfirm.length > 0 && (
        <Block title={t('Check before applying')}>
          <ul style={{ paddingLeft: '18px' }}>
            {result.toConfirm.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Block>
      )}

      {result.papers.length > 0 && (
        <Block title={t('Papers you need')}>
          <ul style={{ paddingLeft: '18px', marginBottom: result.documentIds.length ? '8px' : 0 }}>
            {result.papers.map((paper) => (
              <li key={paper}>{paper}</li>
            ))}
          </ul>
          {result.documentIds.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {result.documentIds.map((id) => {
                const doc = documents.find((d) => d.id === id);
                return doc ? (
                  <button
                    key={id}
                    onClick={() => onOpenDocument(id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--workspace-text-main)',
                      backgroundColor: '#fbfaf8',
                      border: '1px solid var(--workspace-border)',
                      borderRadius: '16px',
                      padding: '4px 10px',
                    }}
                  >
                    <FileText size={12} color="var(--brand-sun)" /> {t('How to get: {name}', { name: doc.name })}
                  </button>
                ) : null;
              })}
            </div>
          )}
        </Block>
      )}

      {result.steps.length > 0 && (
        <Block title={t('How to apply')}>
          <ol style={{ paddingLeft: '18px' }}>
            {result.steps.map((step) => (
              <li key={step} style={{ marginBottom: '3px' }}>
                {step}
              </li>
            ))}
          </ol>
        </Block>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f2efe9' }}>
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: 'var(--brand-sun)',
            borderRadius: '8px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
          }}
        >
          {t('Apply on the official website')} <ExternalLink size={13} />
        </a>
        <button
          onClick={() => onAsk(t('I may be eligible for {name}. How do I apply, step by step?', { name: scheme.name }))}
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--workspace-text-main)',
            border: '1px solid var(--workspace-border)',
            borderRadius: '8px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={13} color="var(--brand-sun)" /> {t('Ask a follow-up')}
        </button>
      </div>
    </article>
  );
};

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: 1.55, marginTop: '10px' }}>
    <h5 style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>{title}</h5>
    {children}
  </div>
);
