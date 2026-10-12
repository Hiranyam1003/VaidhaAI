import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Award, Save } from 'lucide-react';
import type { UserProfile } from '../types';

interface MyProfileProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

export const MyProfile: React.FC<MyProfileProps> = ({ profile, onUpdateProfile }) => {
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
          My Profile & Verification Status
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)' }}>
          Manage citizen profile parameters used for automated scheme matching and DBT verification.
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>Aadhaar e-KYC</div>
            <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 500 }}>Verified & Active</div>
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>NPCI DBT Mapping</div>
            <div style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 500 }}>Bank Account Seeded</div>
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
              Full Name
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
              Email Address
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
              Primary State
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
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              District
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
              Social Category
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
              <option value="General / Open">General / Open</option>
              <option value="EWS (Economically Weaker Section)">EWS</option>
              <option value="OBC (Non-Creamy Layer)">OBC</option>
              <option value="SC / ST">SC / ST</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
              Annual Income Tier
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
              <option value="< 1 Lakh (BPL)">Less than ₹1 Lakh (BPL)</option>
              <option value="< 3 Lakhs (EWS)">₹1L – ₹3L (EWS)</option>
              <option value="3L - 6L (LIG)">₹3L – ₹6L (LIG)</option>
              <option value="₹6 Lakh – ₹8 Lakh (EBC)">₹6L – ₹8L (EBC)</option>
              <option value="8L - 18L (MIG)">₹8L – ₹18L (MIG)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          {savedSuccess && (
            <span style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> Profile preferences updated locally
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
            <Save size={14} /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
