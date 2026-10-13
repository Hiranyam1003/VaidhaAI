import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Award, Save } from 'lucide-react';
import { useT } from '../i18n';
import type { UserProfile } from '../types';

interface MyProfileProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

export const MyProfile: React.FC<MyProfileProps> = ({ profile, onUpdateProfile }) => {
  const t = useT();
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

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
          {t('profile.title')}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)' }}>
          {t('profile.subtitle')}
        </p>
      </div>

      {/* KYC Status Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>{t('profile.kyc')}</div>
            <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 500 }}>{t('profile.kycOk')}</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>{t('profile.dbt')}</div>
            <div style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 500 }}>{t('profile.dbtOk')}</div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--workspace-border)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              {t('profile.fullName')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                padding: '0 12px',
                fontSize: '13px',
                color: 'var(--workspace-text-main)',
                backgroundColor: '#faf8f5',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              {t('profile.email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                padding: '0 12px',
                fontSize: '13px',
                color: 'var(--workspace-text-main)',
                backgroundColor: '#faf8f5',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              {t('profile.state')}
            </label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                padding: '0 12px',
                fontSize: '13px',
                color: 'var(--workspace-text-main)',
                backgroundColor: '#faf8f5',
              }}
            >
              <option value="Maharashtra">{t('state.Maharashtra')}</option>
              <option value="Delhi NCR">{t('state.Delhi NCR')}</option>
              <option value="Karnataka">{t('state.Karnataka')}</option>
              <option value="Uttar Pradesh">{t('state.Uttar Pradesh')}</option>
              <option value="Gujarat">{t('state.Gujarat')}</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              {t('profile.district')}
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                padding: '0 12px',
                fontSize: '13px',
                color: 'var(--workspace-text-main)',
                backgroundColor: '#faf8f5',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              {t('profile.category')}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                padding: '0 12px',
                fontSize: '13px',
                color: 'var(--workspace-text-main)',
                backgroundColor: '#faf8f5',
              }}
            >
              <option value="General / Open">{t('social.general')}</option>
              <option value="EWS (Economically Weaker Section)">{t('social.ews')}</option>
              <option value="OBC (Non-Creamy Layer)">{t('social.obc')}</option>
              <option value="SC / ST">{t('social.scst')}</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              {t('profile.income')}
            </label>
            <select
              value={formData.incomeRange}
              onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                padding: '0 12px',
                fontSize: '13px',
                color: 'var(--workspace-text-main)',
                backgroundColor: '#faf8f5',
              }}
            >
              <option value="< 1 Lakh (BPL)">{t('income.bpl')}</option>
              <option value="< 3 Lakhs (EWS)">{t('income.ews')}</option>
              <option value="3L - 6L (LIG)">{t('income.lig')}</option>
              <option value="₹6 Lakh – ₹8 Lakh (EBC)">{t('income.ebc')}</option>
              <option value="8L - 18L (MIG)">{t('income.mig')}</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          {savedSuccess && (
            <span style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> {t('profile.updated')}
            </span>
          )}

          <button
            type="submit"
            style={{
              marginLeft: 'auto',
              height: '38px',
              padding: '0 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-sun)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(217, 72, 43, 0.3)',
            }}
          >
            <Save size={14} /> {t('profile.save')}
          </button>
        </div>
      </form>
    </div>
  );
};
