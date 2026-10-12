import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface EligibilityCheckerProps {
  onCheckCriteria: (prompt: string) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onCheckCriteria }) => {
  const [state, setState] = useState('Maharashtra');
  const [incomeRange, setIncomeRange] = useState('< 3 Lakhs (EWS)');
  const [category, setCategory] = useState('General / Open');
  const [occupation, setOccupation] = useState('Student / Young Adult');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = `Please evaluate all central and ${state} government welfare schemes for my household: Income: ${incomeRange}, Category: ${category}, Occupation: ${occupation}.`;
    onCheckCriteria(prompt);
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
          Interactive Eligibility Checker
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)' }}>
          Configure your household profile to discover high-match schemes and document prerequisites.
        </p>
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
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
            State / Union Territory
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
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
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
            <option value="All India (Central Only)">All India (Central Only)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
            Annual Family Income
          </label>
          <select
            value={incomeRange}
            onChange={(e) => setIncomeRange(e.target.value)}
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
            <option value="< 1 Lakh (BPL / Antyodaya)">Less than ₹1 Lakh (BPL / Antyodaya)</option>
            <option value="< 3 Lakhs (EWS)">₹1 Lakh – ₹3 Lakhs (Economically Weaker Section)</option>
            <option value="3 - 6 Lakhs (LIG)">₹3 Lakhs – ₹6 Lakhs (Low Income Group)</option>
            <option value="6 - 8 Lakhs (EBC Threshold)">₹6 Lakhs – ₹8 Lakhs (EBC Fee-Waiver Limit)</option>
            <option value="8 - 18 Lakhs (MIG)">₹8 Lakhs – ₹18 Lakhs (Middle Income Group)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
            Social Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            <option value="General / Open">General / Open</option>
            <option value="EWS (Economically Weaker Section)">EWS (Economically Weaker Section)</option>
            <option value="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</option>
            <option value="SC / ST">Scheduled Caste (SC) / Scheduled Tribe (ST)</option>
            <option value="VJNT / SBC">VJNT / SBC (State Specific)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
            Occupation / Primary Focus
          </label>
          <select
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
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
            <option value="Student / Higher Technical Education">Student (Higher & Technical Education)</option>
            <option value="Farmer / Small Landholder">Farmer / Small Landholder</option>
            <option value="Artisan / Traditional Craftsman">Artisan / Traditional Craftsman</option>
            <option value="Daily Wage / Unorganized Laborer">Daily Wage / Unorganized Laborer</option>
            <option value="Salaried / Self-Employed">Salaried / Private Employee</option>
          </select>
        </div>

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
          <span>Run Eligibility Assessment in Chat</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
};
