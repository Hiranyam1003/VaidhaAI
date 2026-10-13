import type React from 'react';

// Styles shared by the login page and the first-login details form.
export const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' };

export const inputBoxStyle: React.CSSProperties = {
  height: '48px',
  borderRadius: '10px',
  border: '1px solid var(--workspace-border)',
  backgroundColor: '#faf8f5',
  color: 'var(--workspace-text-main)',
};

export const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  height: '46px',
  borderRadius: '10px',
  backgroundColor: 'var(--brand-sun)',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  boxShadow: '0 2px 6px rgba(217, 72, 43, 0.3)',
  opacity: disabled ? 0.55 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
});
