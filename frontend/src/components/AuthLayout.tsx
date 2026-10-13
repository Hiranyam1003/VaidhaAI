import React from 'react';

// Shared centred card used by the login page and the first-login details form.
export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      minHeight: '100%',
      overflowY: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      backgroundColor: 'var(--workspace-bg)',
    }}
  >
    <main
      className="fade-in"
      style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--workspace-border)',
        borderRadius: '18px',
        padding: '28px 24px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
        <img src="/assets/vaidha-logo.jpeg" alt="Vaidha AI" style={{ width: '64px', height: '64px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }} />
      </div>
      {children}
    </main>
  </div>
);
